import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { filter, flatMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../messenger/messenger.model';
import { MessengerService } from '../messenger/messenger.service';
import { Process, Step } from './process.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  public current = new BehaviorSubject<Process>(null);
  public all = new BehaviorSubject<Process[]>(null);
  public stepRendered = new BehaviorSubject<string>(null);

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private messengerService: MessengerService
  ) {
    this
      .messageListening()
      .subscribe();
  }

  getAll() {
    const url = `${environment.bff}/process`;
    return this.httpClient
      .get<Process[]>(url)
      .pipe(tap(processes => this.all.next(processes)));
  }

  getCurrent(activatedRoute: ActivatedRoute = null) {

    const currentProcess = this.current.value;

    if (currentProcess) {
      return of(currentProcess);
    } else {
      const id = activatedRoute ? activatedRoute.snapshot.paramMap.get('processId') : null;
      return id
        ? this.get(id)
        : of(currentProcess);
    }
  }

  get(id: number | string) {
    const url = `${environment.bff}/process/${id}`;
    return this.httpClient
      .get<Process>(url)
      .pipe(
        tap(process => this.current.next(process))
      );
  }

  post() {
    const url = `${environment.bff}/process`;
    return this.httpClient
      .post<Process>(url, {})
      .pipe(
        tap(process => this.emitUpdateProcess(process.id))
      );
  }

  saveStep(step: Step, { warnChange = false, moveNextStep = false }) {
    return this
      .getCurrent()
      .pipe(
        flatMap((currentProcess) => {
          const url = `${environment.bff}/process/${currentProcess.id}/step/${step.codeName}`;
          return this.httpClient
            .patch<Process>(url, step)
            .pipe(
              tap((process) => {
                if (warnChange) {
                  this.emitUpdateProcess(process.id);
                }
                if (moveNextStep) {
                  this.emitMoveNextStep(process.id);
                }
              })
            );
        })
      );
  }

  updateLastAcessStep(step: Step) {
    step.lastAcess = new Date();
    return this
      .saveStep(step, { warnChange: true });
  }

  navigateToStep(process: Process, step: Step) {
    this.router.navigate(['/process', process.id, step.codeName]);
  }

  private messageListening() {
    return this.messengerService
      .receptor()
      .pipe(
        tap((message) => {
          switch (message.subject) {
            case 'update-process':
              this.handleUpdateProcess(message);
              break;
            case 'move-next-step':
              this.handleMoveNextStep(message);
              break;
            case 'step-rendered':
              this.handleStepRendered(message);
              break;
            default:
              break;
          }
        })
      );
  }

  private handleUpdateProcess(message: Message) {

    const { processId } = message.body;

    const updateCurrent = this.getCurrent()
      .pipe(
        filter(process => Boolean(process) && process.id === processId),
        flatMap(process => this.get(processId))
      );

    this.getAll()
      .pipe(
        flatMap(() => updateCurrent)
      )
      .subscribe();
  }

  private emitUpdateProcess(processId: number) {
    const body = { processId };
    const message = this.messengerService.getMessage('update-process', body);
    this.messengerService.send(message);
  }

  private handleMoveNextStep(message: Message) {

    const { processId } = message.body;

    this.getCurrent()
      .pipe(
        filter(process => Boolean(process) && process.id === processId),
        tap((process) => this.navigateToStep(process, process.nextStep))
      )
      .subscribe();
  }

  private emitMoveNextStep(processId: number) {
    const body = { processId };
    const message = this.messengerService.getMessage('move-next-step', body);
    this.messengerService.send(message);
  }

  private handleStepRendered(message: Message) {

    const { processId, stepCodeName } = message.body;

    this.getCurrent()
      .pipe(
        filter(process => Boolean(process) && process.id === processId),
        tap(() => this.stepRendered.next(stepCodeName))
      )
      .subscribe();
  }
}
