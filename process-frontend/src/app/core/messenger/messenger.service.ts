import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Process } from '../process/process.model';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  constructor(
    private socket: Socket
  ) { }

  newConnectionsListening() {
    return this.socket.fromEvent<string>('new-connections');
  }

  changeProcessListening() {
    return this.socket.fromEvent<Process>('change-process');
  }

  changeProcessEmit(process: Process) {
    this.socket.emit('on-change-process', process);
  }

  nextStepListening() {
    return this.socket.fromEvent<Process>('next-step');
  }

  nextStepEmit(process: Process) {
    this.socket.emit('on-next-step', process);
  }

  backStepListening() {
    return this.socket.fromEvent<Process>('back-step');
  }

  backStepEmit(process: Process) {
    this.socket.emit('on-back-step', process);
  }


  blockProcessListening() {
    return this.socket.fromEvent<Process>('block-process');
  }

  blockProcessEmit(process: Process) {
    this.socket.emit('on-block-process', process);
  }

  unlockProcessListening() {
    return this.socket.fromEvent<Process>('unlock-process');
  }

  unlockProcessEmit(process: Process) {
    this.socket.emit('on-unlock-process', process);
  }
}
