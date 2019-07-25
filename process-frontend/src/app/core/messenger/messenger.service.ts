import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Process } from '../process/process.model';
import { Message } from './messenger.model';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  public currentDevice: string;

  constructor(
    private socket: Socket
  ) {
    this.currentDevice = window.navigator.productSub;
  }

  receptor() {
    return this.socket.fromEvent<Message>('message');
  }

  send(message: Message) {
    this.socket.emit('on-message', message);
  }

  getMessage(subject: string, body: any): Message {
    return {
      date: new Date(),
      app: 'process-frontend',
      device: this.currentDevice,
      subject,
      from: '',
      body
    };
  }
}
