import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: signalR.HubConnection;
  
  // Поток данных, на который подпишется компонент
  public records$ = new BehaviorSubject<any[]>([]);

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7171/records-hub') // <-- ВАШ ПОРТ API
      .withAutomaticReconnect()
      .build();
  }

  public startConnection = () => {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
      
    // Слушаем событие от сервера
    this.hubConnection.on('RecordAdded', (data) => {
      console.log('Received:', data);
      // Добавляем новую запись в текущий массив
      const currentData = this.records$.value;
      this.records$.next([data, ...currentData]);
    });
  }
}