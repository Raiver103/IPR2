import { Injectable, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: signalR.HubConnection | undefined; 
  
  public records$ = new Subject<void>();

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const userId = this.getOrCreateUserId();
      
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:7171/records-hub?userId=${userId}`)
        .withAutomaticReconnect()
        .build();
    }
  }

  private getOrCreateUserId(): string {
    if (!isPlatformBrowser(this.platformId)) return '';

    let id = localStorage.getItem('my_app_user_id');
    if (!id) {
      id = crypto.randomUUID(); 
      localStorage.setItem('my_app_user_id', id);
    }
    return id;
  }

  public get currentUserId(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('my_app_user_id') || '';
    }
    return '';
  }
  
  public startConnection = () => {
    if (!this.hubConnection) return;

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
      
    this.hubConnection.on('RecordAdded', (data) => {
      console.log('Received signal:', data);
      
      this.ngZone.run(() => {
        this.records$.next(); 
      });
    });
  }
}
