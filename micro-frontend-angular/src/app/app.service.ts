import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { tap } from 'rxjs/operators';
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

  saveStep(process, step, { warnChange = false, moveNextStep = false }) {
    const url = `${environment.bff}/process/${process.id}/step/${step.codeName}`;
    return this.httpClient
      .patch<any>(url, step)
      .pipe(
        tap((processUpdated) => {

          this.emitLoadingStep(processUpdated.id);

          if (warnChange) {
            this.emitUpdateProcess(processUpdated);
          }
          if (moveNextStep) {
            this.emitMoveStepper(processUpdated.id, processUpdated.nextStep.codeName);
          }
        })
      );
  }

  private emitUpdateProcess(process) {
    const message = this.getMessage('update-process', process);
    this.sendMessage(message);
  }

  private emitMoveStepper(processId: number, codeName: string) {
    const body = { processId, codeName };
    const message = this.getMessage('move-stepper', body);
    this.sendMessage(message);
  }

  private emitLoadingStep(processId: number) {
    const body = { processId };
    const message = this.getMessage('loading-step', body);
    this.sendMessage(message);
  }

  private getMessage(subject: string, body: any) {
    return {
      date: new Date(),
      app: 'micro-frontend-angular',
      device: '',
      subject,
      from: '',
      body
    };
  }

  sendMessage(message) {
    this.emit('on-message', message);
  }
}
