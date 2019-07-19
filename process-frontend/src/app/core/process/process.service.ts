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

  get(id: string) {
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
        tap(process => this.emitUpdateProcess(process))
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
                  this.emitUpdateProcess(process);
                }
                if (moveNextStep) {
                  this.emitMoveStepper(process.id, process.nextStep.codeName);
                }
              })
            );
        })
      );
  }

  navigateToStep(processId: number, codeName: string) {
    this.router.navigate(['/process', processId, codeName]);
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
            case 'move-stepper':
              this.handleMoveStepper(message);
              break;
            default:
              break;
          }
        })
      );
  }

  private handleUpdateProcess(message: Message) {

    const { id } = message.body;

    const updateCurrent = this.getCurrent()
      .pipe(
        filter(process => Boolean(process) && process.id === id),
        flatMap(process => this.get(id))
      );

    this.getAll()
      .pipe(
        flatMap(() => updateCurrent)
      )
      .subscribe();
  }

  private emitUpdateProcess(process: Process) {
    const message = this.messengerService.getMessage('update-process', process);
    this.messengerService.send(message);
  }

  private handleMoveStepper(message: Message) {

    const { processId, codeName } = message.body;

    this.getCurrent()
      .pipe(
        filter(process => Boolean(process) && process.id === processId),
        tap(() => this.navigateToStep(processId, codeName))
      );
  }

  private emitMoveStepper(processId: number, codeName: string) {
    const body = { processId, codeName };
    const message = this.messengerService.getMessage('move-stepper', body);
    this.messengerService.send(message);
  }
}