import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket = io(':3001');

  constructor() {
    this.socket.on('connect', () => {
      console.log('Socket connected!');
    });

    this.socket.on('connect_error', (err) => {
      console.log(`Could not connect due to `, err);
    });
  }

  on(event: string, callback: (...args: any) => void) {
    this.socket.on(event, callback);
  }
}
