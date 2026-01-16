import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Добавили ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { SignalrService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'client-app';
  inputText = '';
  records: any[] = [];

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
    if (!this.inputText) return;
 
    const textToSend = this.inputText; 
 
    this.inputText = ''; 

    const query = {
      query: `mutation { addRecord(name: "${textToSend}") { id name createdAt } }`
    };

    this.http.post('https://localhost:7171/graphql', query).subscribe({ 
      error: (err) => {
        console.error('Error:', err);
        this.inputText = textToSend;
      }
    });
  }
}