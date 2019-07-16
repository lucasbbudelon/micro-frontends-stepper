import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppService extends Socket {

  constructor(
    private httpClient: HttpClient
  ) {
    super({ url: environment.messenger, options: {} });
  }

  getProcess(id: string) {
    const url = `${environment.bff}/process/${id}`;
    return this.httpClient.get<any>(url);
  }

  nextStepEmit(process) {
    this.emit('on-next-step', process);
  }

  backStepEmit(process) {
    this.emit('on-back-step', process);
  }
}
