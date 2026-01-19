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
  listName = '';
  listItemsStr = '';
  protected Math = Math;
  records: TodoList[] = [];
  
  currentPage = 0;  
  pageSize = 5;    
  totalCount = 0;    
  
  filterText = ''; 

  constructor(
    public signalrService: SignalrService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.loadRecords();

    this.signalrService.startConnection();

    this.signalrService.records$.subscribe(() => {
      console.log('SignalR: New data has arrived, we are updating the list...');
      this.loadRecords();
    });
  }
 
  loadRecords() { 
    const skip = this.currentPage * this.pageSize;
 
    const query = {
      query: `
        query {
          records(
            skip: ${skip}, 
            take: ${this.pageSize}, 
            order: { createdAt: DESC }, 
            where: { name: { contains: "${this.filterText}" } }
          ) {
            totalCount
            items {
              id
              name
              items {
                text
              }
            }
          }
        }
      `
    };

    this.http.post<any>('https://localhost:7171/graphql', query).subscribe({
      next: (res) => {
        const data = res.data?.records;
        if (data) {
          this.records = data.items; 
          this.totalCount = data.totalCount; 
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error(err)
    });
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.totalCount) {
      this.currentPage++;
      this.loadRecords();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadRecords();
    }
  }

  onSearchChange() {
    this.currentPage = 0;
    this.loadRecords();
  }

  sendMessage() {
    if (!this.listName || !this.listItemsStr) return;
 
    const nameToSend = this.listName; 
    const rawItemsStr = this.listItemsStr;

    const itemsArray = rawItemsStr.split(',').map(s => s.trim()).filter(s => s.length > 0)
        .map(s => `{ text: "${s}" }`); 
    const itemsGraphQLString = `[${itemsArray.join(', ')}]`;

    this.listName = ''; 
    this.listItemsStr = '';

    const query = {
      query: `
        mutation { 
          addRecord(name: "${nameToSend}", items: ${itemsGraphQLString}) { 
            id 
          } 
        }`
    };

    this.http.post('https://localhost:7171/graphql', query).subscribe({ 
      error: (err) => {
        this.listName = nameToSend;
        this.listItemsStr = rawItemsStr;
      }
    });
  }
}