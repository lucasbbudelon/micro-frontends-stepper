import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { catchError, flatMap, takeUntil, tap } from 'rxjs/operators';
import { BackendFeedbackService } from 'src/app/components/backend-feedback/backend-feedback.service';
import { Process } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit, OnDestroy {

  public process: Process;
  public waitRedirection: number;
  public missingRime: number;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private backendFeedbackService: BackendFeedbackService,
    private processService: ProcessService
  ) {
    this.waitRedirection = 9;
    this.missingRime = this.waitRedirection;
  }

  ngOnInit() {

    this.processService.getCurrent(this.activatedRoute)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(process => this.process = process),
        flatMap(() => this.timerToRedirect()),
        catchError(error => this.backendFeedbackService.handleError(error))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  navigateToCurrentStep() {
    this.processService.navigateToStep(this.process, this.process.currentStep);
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
