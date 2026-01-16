import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: signalR.HubConnection;
  
  public records$ = new BehaviorSubject<any[]>([]);

  constructor(private ngZone: NgZone) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7171/records-hub')
      .withAutomaticReconnect()
      .build();
  }

  public startConnection = () => {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
      
    this.hubConnection.on('RecordAdded', (data) => {
      console.log('Received:', data);
      
      this.ngZone.run(() => {
        const currentData = this.records$.value;
        this.records$.next([data, ...currentData]);
      });
    });
  }
}