import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, flatMap } from 'rxjs/operators';
import { BackendFeedbackService } from 'src/app/components/backend-feedback/backend-feedback.service';
import { Process, Step } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, AfterContentInit {

  public process: Process;
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
        flatMap(process => this.loadData(process)),
        catchError(error => this.backendFeedbackService.handleError(error)),
        finalize(() => this.backendFeedbackService.hideLoading())
      )
      .subscribe();
  }

  public ngAfterContentInit() {
    setTimeout(() => {
      const form = window.document.forms[0];
      if (!form) { return; }
      const element: any = form.elements[0];
      if (!element) { return; }
      element.focus();
    }, 500);
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

  private loadData(process: Process) {
    this.process = process;
    const codeName = this.activatedRoute.snapshot.routeConfig.path;
    this.step = process.steps.find(s => s.codeName === codeName);
    return this.processService.updateLastAcessStep(this.step);
  }
}
