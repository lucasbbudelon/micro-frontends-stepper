import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { catchError, finalize, flatMap, tap } from 'rxjs/operators';
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
  public waitRedirection: number;
  public missingRime: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private backendFeedbackService: BackendFeedbackService,
    private processService: ProcessService
  ) {
    this.waitRedirection = 9;
    this.missingRime = this.waitRedirection;
  }

  ngOnInit() {

    this.backendFeedbackService.showLoading();

    this.processService.getCurrent(this.activatedRoute)
      .pipe(
        tap(process => this.process = process),
        flatMap(() => this.timerToRedirect()),
        catchError(error => this.backendFeedbackService.handleError(error)),
        finalize(() => this.backendFeedbackService.showLoading())
      )
      .subscribe();
  }


  navigateToCurrentStep() {
    this.processService.navigateToStep(this.process.id, this.process.currentStep.codeName);
  }

  private timerToRedirect() {
    return timer(1000, 1000)
      .pipe(
        tap((second) => {
          this.missingRime = this.waitRedirection - second;
          if (second > this.waitRedirection) {
            this.navigateToCurrentStep();
          }
        })
      );
  }
}