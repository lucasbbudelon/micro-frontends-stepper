import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { BackendFeedbackService } from './backend-feedback.service';

@Component({
  selector: 'app-backend-feedback',
  templateUrl: './backend-feedback.component.html',
  styleUrls: ['./backend-feedback.component.scss']
})
export class BackendFeedbackComponent implements OnInit {

  public loading: boolean;
  public successMessage: string;
  public infoMessage: string;
  public alertMessage: string;
  public errorMessage: string;

  constructor(
    public backendFeedbackService: BackendFeedbackService
  ) { }

  ngOnInit() {
    this.backendFeedbackService.loading
      .pipe(
        distinctUntilChanged(),
        tap(value => this.loading = value)
      )
      .subscribe();

    this.backendFeedbackService.successMessage
      .pipe(
        distinctUntilChanged(),
        tap(value => this.successMessage = value)
      )
      .subscribe();

    this.backendFeedbackService.infoMessage
      .pipe(
        distinctUntilChanged(),
        tap(value => this.infoMessage = value)
      )
      .subscribe();

    this.backendFeedbackService.alertMessage
      .pipe(
        distinctUntilChanged(),
        tap(value => this.alertMessage = value)
      )
      .subscribe();

    this.backendFeedbackService.errorMessage
      .pipe(
        distinctUntilChanged(),
        tap(value => this.errorMessage = value)
      )
      .subscribe();
  }
}
