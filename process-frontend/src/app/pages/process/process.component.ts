import { Component, OnInit } from '@angular/core';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { BackendFeedbackService } from 'src/app/components/backend-feedback/backend-feedback.service';
import { Process } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {

  public process: Process;
  public timeRedirection = 10;

  constructor(
    private backendFeedbackService: BackendFeedbackService,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.backendFeedbackService.showLoading();

    this.processService.getCurrent()
      .pipe(
        tap(process => this.process = process),
        delay(this.timeRedirection * 1000),
        tap(() => this.navigateToCurrentStep()),
        catchError(error => this.backendFeedbackService.handleError(error)),
        finalize(() => this.backendFeedbackService.showLoading())
      )
      .subscribe();
  }

  navigateToCurrentStep() {
    this.processService.navigateToStep(this.process.id, this.process.currentStep.codeName);
  }
}
