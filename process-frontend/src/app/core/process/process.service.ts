import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessengerService } from '../messenger/messenger.service';
import { Process, Step } from './process.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  public currenrProcess = new BehaviorSubject<Process>(null);
  public processes = new BehaviorSubject<Process[]>(null);

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private messengerService: MessengerService
  ) {

  }

  getAll() {
    const url = `${environment.bff}/process`;
    return this.httpClient
      .get<Process[]>(url)
      .pipe(tap(processes => this.processes.next(processes)));
  }

  get(id: number | string) {
    const url = `${environment.bff}/process/${id}`;
    return this.httpClient
      .get<Process>(url)
      .pipe(tap(process => this.updateCurrenrProcess(process)));
  }

  post() {
    const url = `${environment.bff}/process`;
    return this.httpClient
      .post<Process>(url, {})
      .pipe(tap(process => this.messengerService.changeProcessEmit(process)));
  }

  patch(step: Step) {

    const currentProcess = this.currenrProcess.value;
    const url = `${environment.bff}/process/${currentProcess.id}/step/${step.id}`;

    return this.httpClient
      .patch<Process>(url, step)
      .pipe(tap(process => this.updateCurrenrProcess(process)));
  }

  updateLastAcessStep(stepId: string) {
    const currentStep = this.getStepByCurrentProcess(stepId);
    currentStep.lastAcess = new Date();
    return this
      .patch(currentStep)
      .pipe(tap(process => this.updateCurrenrProcess(process)));
  }

  backStep(stepId: string) {

    const step = this.getStepByCurrentProcess(stepId);

    step.lastUpdate = new Date();

    return this.patch(step)
      .pipe(tap(process => this.messengerService.backStepEmit(process)));
  }

  nextStep(stepId: string) {
    const step = this.getStepByCurrentProcess(stepId);

    step.lastUpdate = new Date();
    step.completed = true;

    return this.patch(step)
      .pipe(tap(process => this.messengerService.nextStepEmit(process)));
  }

  handleChangeRouter(router: string) {
    const id = window.location.search.split('=')[1];

    if (id || this.currenrProcess.value) {
      const observableProcess = this.currenrProcess.value
        ? this.updateLastAcessStep(router)
        : this.get(id);

      observableProcess
        .pipe(
          tap(process => this.navigateToStep(process.id, process.currentStep.id)),
          catchError(error => this.router.navigate([error.status === 404 ? 'not-found' : 'error']))
        )
        .subscribe();
    }
  }

  handleNextStep(process: Process) {
    if (process.id === this.currenrProcess.value.id) {
      this.navigateToStep(process.id, process.nextStep.id);
    }
  }

  handleBackStep(process: Process) {
    if (process.id === this.currenrProcess.value.id) {
      this.navigateToStep(process.id, process.backStep.id);
    }
  }

  handleChangeProcess(process: Process) {
    console.log(`${(new Date()).toLocaleTimeString()}: change-process # ${process.id}`);
    if (!this.currenrProcess.value || this.currenrProcess.value.id === process.id) {
      this.get(process.id).subscribe();
    }
  }

  keepProcess() {
    this.messengerService.blockProcessEmit(this.currenrProcess.value);
    this.messengerService.unlockProcessEmit(this.currenrProcess.value);
  }

  getStepByCurrentProcess(stepId: string) {
    return this.currenrProcess.value.steps.find(s => s.id === stepId);
  }

  private updateCurrenrProcess(process: Process) {
    this.messengerService.changeProcessEmit(process);
    this.currenrProcess.next(process);
  }

  private navigateToStep(processId: number, stepId: string) {
    this.router.navigate([stepId], { queryParams: { id: processId } });
  }
}
