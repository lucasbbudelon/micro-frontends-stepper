import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap, flatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessengerService } from '../messenger/messenger.service';
import { Process, Step } from './process.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  public current = new BehaviorSubject<Process>(null);
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

  getCurrent() {

    if (this.current.value) {
      return of(this.current.value);
    }

    const id = this.getIdByQueryString();

    return id
      ? this.get(id)
      : of(null);
  }

  get(id: number | string) {
    const url = `${environment.bff}/process/${id}`;
    return this.httpClient
      .get<Process>(url)
      .pipe(
        tap(process => this.updateCurrent(process))
      );
  }

  post() {
    const url = `${environment.bff}/process`;
    return this.httpClient
      .post<Process>(url, {})
      .pipe(
        tap(process => this.messengerService.changeProcessEmit(process))
      );
  }

  patch(step: Step) {
    return this
      .getCurrent()
      .pipe(
        flatMap((process) => {
          const url = `${environment.bff}/process/${process.id}/step/${step.codeName}`;
          return this.httpClient
            .patch<Process>(url, step)
            .pipe(
              tap(p => this.updateCurrent(p))
            );
        })
      );
  }

  // updateLastAcess(process: Process, codeNameStep: string) {
  //   const step = this.getStep(process, codeNameStep);
  //   step.lastAcess = new Date();
  //   return this
  //     .patch(step)
  //     .pipe(
  //       tap(p => this.updateCurrent(p))
  //     );
  // }

  updateLastAcess(codeNameStep: string) {
    return this
      .getCurrent()
      .pipe(
        flatMap((process) => {
          const step = this.getStep(process, codeNameStep);
          step.lastAcess = new Date();
          return this
            .patch(step)
            .pipe(
              tap(p => this.updateCurrent(p))
            );
        })
      );
  }

  save(step: Step) {
    step.lastUpdate = new Date();
    return this.patch(step);
  }

  navigateToStep(processId: number, codeName: string) {
    this.router.navigate([codeName], { queryParams: { process: processId } });
  }


  backStep(process: Process, codeNameStep: string) {

    const step = this.getStep(process, codeNameStep);

    step.lastUpdate = new Date();

    return this.patch(step)
      .pipe(
        tap(p => this.messengerService.backStepEmit(p))
      );
  }

  nextStep(process: Process, codeNameStep: string) {

    const step = this.getStep(process, codeNameStep);

    step.lastUpdate = new Date();

    return this.patch(step)
      .pipe(
        tap(p => this.messengerService.nextStepEmit(p))
      );
  }

  handleNextStep(process: Process) {
    if (process.id === this.current.value.id) {
      this.navigateToStep(process.id, process.nextStep.codeName);
    }
  }

  handleBackStep(process: Process) {
    if (process.id === this.current.value.id) {
      this.navigateToStep(process.id, process.backStep.codeName);
    }
  }

  handleChangeProcess(process: Process) {
    console.log(`${(new Date()).toLocaleTimeString()}: change-process # ${process.id}`);
    if (!this.current.value || this.current.value.id === process.id) {
      this.get(process.id).subscribe();
    }
  }

  keepProcess() {
    this.messengerService.blockProcessEmit(this.current.value);
    this.messengerService.unlockProcessEmit(this.current.value);
  }

  getStep(process: Process, codeNameStep: string) {
    return process.steps.find(s => s.codeName === codeNameStep);
  }

  private getIdByQueryString() {
    const id = window.location.search.split('=')[1];
    return id;
  }

  private updateCurrent(process: Process) {
    this.messengerService.changeProcessEmit(process);
    this.current.next(process);
  }
}
