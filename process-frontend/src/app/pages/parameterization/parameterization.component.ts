import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { filter, finalize, flatMap, tap } from 'rxjs/operators';
import { BackendFeedbackService } from 'src/app/components/backend-feedback/backend-feedback.service';
import { Process, Step } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-parameterization',
  templateUrl: './parameterization.component.html',
  styleUrls: ['./parameterization.component.scss']
})
export class ParameterizationComponent implements OnInit {

  public step: Step;
  public errorRendered: boolean;
  public url: SafeResourceUrl;

  private waitRenderStepTimer = 3000;
  private waitRenderStepTimerSubscription: Subscription;

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
        flatMap(process => this.loadStep(process))
      )
      .subscribe();

    this.processService.stepRendered
      .pipe(
        filter(stepCodeName => Boolean(stepCodeName) && stepCodeName === this.step.codeName),
        tap(() => this.waitRenderStepTimerSubscription.unsubscribe())
      )
      .subscribe();
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
