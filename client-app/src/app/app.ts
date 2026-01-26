import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': 'secret-123'
    })
  };

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
    const myId = this.signalrService.currentUserId;

    const queryOperation = `
      query GetRecords($userId: String!, $skip: Int!, $take: Int!, $filter: String) {
        records(
          userId: $userId,
          skip: $skip, 
          take: $take, 
          order: { createdAt: DESC }, 
          where: { name: { contains: $filter } }
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
    `;

    const variables = {
      userId: myId,
      skip: skip,
      take: this.pageSize,
      filter: this.filterText
    };

    this.http.post<any>(
      'https://localhost:7171/graphql', 
      { query: queryOperation, variables: variables },
      this.httpOptions
    ).subscribe({
      next: (res) => {
        if (res.errors) {
          console.error('GraphQL error:', res.errors);
            return;
        }
        const data = res.data?.records;
        if (data) {
          this.records = data.items; 
          this.totalCount = data.totalCount; 
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Networks error:', err)
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
    const myId = this.signalrService.currentUserId;
    if (!this.listName || !this.listItemsStr) return;

    const nameToSend = this.listName; 
    
    const itemsData = this.listItemsStr
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => ({ text: s }));

    // Очищаем форму сразу
    this.listName = ''; 
    this.listItemsStr = '';

    const mutationOperation = `
      mutation AddRecord($userId: String!, $name: String!, $items: [RecordItemInput!]!) { 
        addRecord(userId: $userId, name: $name, items: $items) { 
          id 
        } 
      }`;

    const variables = {
      userId: myId,
      name: nameToSend,
      items: itemsData
    };

    this.http.post<any>(
      'https://localhost:7171/graphql', 
      { query: mutationOperation, variables: variables }, 
      this.httpOptions
    ).subscribe({ 
      next: (res) => {
         if (res.errors) {
           console.error('Mutation error :', res.errors);
             this.listName = nameToSend;
             this.listItemsStr = itemsData.map(x => x.text).join(', ');
         }
      },
      error: (err) => {
        console.error(err);
        this.listName = nameToSend;
      }
    });
  }
}
