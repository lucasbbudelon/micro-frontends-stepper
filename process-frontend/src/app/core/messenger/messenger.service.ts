import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Process } from '../process/process.model';
import { Message } from './messenger.model';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  constructor(
    private socket: Socket
  ) { }

  receptor() {
    return this.socket.fromEvent<Message>('message');
  }

  send(message: Message) {
    this.socket.emit('on-message', message);
  }

  getMessage(subject: string, body: any): Message {
    return {
      app: 'process-frontend',
      device: '',
      subject,
      from: '',
      body
    };
  }
}
