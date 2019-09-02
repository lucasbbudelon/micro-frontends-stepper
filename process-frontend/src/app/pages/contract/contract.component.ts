import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, finalize, flatMap, takeUntil } from 'rxjs/operators';
import { BackendFeedbackService } from 'src/app/components/backend-feedback/backend-feedback.service';
import { Field, Process, Step } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';
import { TERMS } from './contract.constants';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit, OnDestroy {

  public codeNameStep = 'contract';
  public codeNameField = 'date-signature';

  public process: Process;
  public contract: Step;
  public dateSignature: Field;
  public terms = TERMS;

  public accept: boolean;
  public confirm: boolean;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private backendFeedbackService: BackendFeedbackService,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.backendFeedbackService.showLoading();
    this.processService.getCurrent(this.activatedRoute)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        flatMap(process => this.loadStep(process)),
        catchError(error => this.backendFeedbackService.handleError(error)),
        finalize(() => this.backendFeedbackService.hideLoading())
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  signature() {
    this.backendFeedbackService.showLoading();
    this.contract.lastUpdate = new Date();
    this.dateSignature.value = this.getDateTimeSignature();
    this.processService
      .saveStep(this.contract, { warnChange: true, moveNextStep: true, warnSignature: true })
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(error => this.backendFeedbackService.handleError(error)),
        finalize(() => this.backendFeedbackService.hideLoading())
      )
      .subscribe();
  }

  disabledSignature() {
    const anyStepsNotCompleted = this.process.steps.filter(s => !s.completed);
    return !this.accept || !this.confirm || anyStepsNotCompleted.length > 1;
  }

  private loadStep(process: Process) {
    this.process = process;
    this.contract = process.steps.find(s => s.codeName === this.codeNameStep);
    this.dateSignature = this.contract.fields ? this.contract.fields.find(f => f.codeName === this.codeNameField) : null;
    return this.processService.updateLastAcessStep(this.contract);
  }

  private getDateTimeSignature() {
    const dateNow = new Date();
    return `${dateNow.toLocaleDateString()} ${dateNow.toLocaleTimeString()}`;
  }
}
