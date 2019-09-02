import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { BackendFeedbackService } from './backend-feedback.service';

@Component({
  selector: 'app-backend-feedback',
  templateUrl: './backend-feedback.component.html',
  styleUrls: ['./backend-feedback.component.scss']
})
export class BackendFeedbackComponent implements OnInit, OnDestroy {

  public loading: boolean;
  public successMessage: string;
  public infoMessage: string;
  public alertMessage: string;
  public errorMessage: string;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    public backendFeedbackService: BackendFeedbackService
  ) { }

  ngOnInit() {
    this.backendFeedbackService.loading
      .pipe(
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(),
        tap(value => this.loading = value)
      )
      .subscribe();

    this.backendFeedbackService.successMessage
      .pipe(
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(),
        tap(value => this.successMessage = value)
      )
      .subscribe();

    this.backendFeedbackService.infoMessage
      .pipe(
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(),
        tap(value => this.infoMessage = value)
      )
      .subscribe();

    this.backendFeedbackService.alertMessage
      .pipe(
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(),
        tap(value => this.alertMessage = value)
      )
      .subscribe();

    this.backendFeedbackService.errorMessage
      .pipe(
        takeUntil(this.ngUnsubscribe),
        distinctUntilChanged(),
        tap(value => this.errorMessage = value)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
