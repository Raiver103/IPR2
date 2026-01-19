import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { SignalrService } from './services/signalr.service';

export interface TodoItem { text: string; isCompleted?: boolean; }
export interface TodoList { id: string; name: string; items: TodoItem[]; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'client-app';
  
  listName = '';      
  listItemsStr = '';
  
  records: TodoList[] = [];

  constructor(
    public signalrService: SignalrService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.signalrService.startConnection();

    this.signalrService.records$.subscribe((data) => { 
      this.records = data;
      this.cdr.detectChanges(); 
    });
  }

  sendMessage() {
    if (!this.listName || !this.listItemsStr) return;
 
    const nameToSend = this.listName; 
    const rawItemsStr = this.listItemsStr;

    const itemsArray = rawItemsStr
        .split(',')                 
        .map(s => s.trim())      
        .filter(s => s.length > 0)   
        .map(s => `{ text: "${s}" }`); 

    const itemsGraphQLString = `[${itemsArray.join(', ')}]`;

    // Очищаем поля (Оптимистично)
    this.listName = ''; 
    this.listItemsStr = '';

    const query = {
      query: `
        mutation { 
          addRecord(
            name: "${nameToSend}", 
            items: ${itemsGraphQLString} 
          ) { 
            id 
            name 
            createdAt
            items { 
              text 
              isCompleted
            } 
          } 
        }`
    };

    console.log('Query:', query); 

    this.http.post('https://localhost:7171/graphql', query).subscribe({ 
      next: (res) => console.log('Успех:', res),
      error: (err) => {
        console.error('Error:', err);
        this.listName = nameToSend;
        this.listItemsStr = rawItemsStr;
      }
    });
  }
}
