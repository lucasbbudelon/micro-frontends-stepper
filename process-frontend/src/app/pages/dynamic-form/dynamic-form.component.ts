import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, flatMap, tap } from 'rxjs/operators';
import { BackendFeedbackService } from 'src/app/components/backend-feedback/backend-feedback.service';
import { Process, Step } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  public step: Step;

  constructor(
    private activatedRoute: ActivatedRoute,
    private backendFeedbackService: BackendFeedbackService,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.backendFeedbackService.showLoading();
    this.processService.getCurrent(this.activatedRoute)
      .pipe(
        tap(process => this.loadStep(process)),
        flatMap(process => this.updateLastAcess(process)),
        catchError(error => this.backendFeedbackService.handleError(error)),
        finalize(() => this.backendFeedbackService.hideLoading())
      )
      .subscribe();
  }

  submit() {
    this.backendFeedbackService.showLoading();

    this.step.lastUpdate = new Date();
    this.processService
      .saveStep(this.step, { warnChange: true, moveNextStep: true })
      .pipe(
        catchError(error => this.backendFeedbackService.handleError(error)),
        finalize(() => this.backendFeedbackService.hideLoading())
      )
      .subscribe();
  }

  private loadStep(process: Process) {
    const codeName = this.activatedRoute.snapshot.routeConfig.path;
    this.step = process.steps.find(s => s.codeName === codeName);
  }

  private updateLastAcess(process: Process) {
    this.step.lastAcess = new Date();
    return this.processService
      .saveStep(this.step, { warnChange: true });
  }
}
