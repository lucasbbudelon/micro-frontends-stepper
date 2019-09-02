import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, timer } from 'rxjs';
import { filter, finalize, flatMap, takeUntil, tap } from 'rxjs/operators';
import { BackendFeedbackService } from 'src/app/components/backend-feedback/backend-feedback.service';
import { Process, Step } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-parameterization',
  templateUrl: './parameterization.component.html',
  styleUrls: ['./parameterization.component.scss']
})
export class ParameterizationComponent implements OnInit, OnDestroy {

  public step: Step;
  public errorRendered: boolean;
  public url: SafeResourceUrl;

  private waitRenderStepTimer = 3000;
  private waitRenderStepTimerSubscription: Subscription;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private backendFeedbackService: BackendFeedbackService,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.processService
      .getCurrent()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        flatMap(process => this.loadStep(process))
      )
      .subscribe();

    this.processService.stepRendered
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(stepCodeName => Boolean(stepCodeName) && stepCodeName === this.step.codeName),
        tap(() => this.waitRenderStepTimerSubscription.unsubscribe())
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadStep(process: Process) {
    const currentRouter = this.activatedRoute.routeConfig.path;
    const step = process.steps.find(s => s.codeName === currentRouter);
    const url = `${step.url}?process=${process.id}`;
    this.step = step;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.waitRenderStep();
    return this.processService.updateLastAcessStep(this.step);
  }

  private waitRenderStep() {
    this.backendFeedbackService.showLoading();
    this.waitRenderStepTimerSubscription = timer(this.waitRenderStepTimer)
      .pipe(
        tap(() => this.errorRendered = true),
        finalize(() => this.backendFeedbackService.hideLoading())
      )
      .subscribe();
  }
}
