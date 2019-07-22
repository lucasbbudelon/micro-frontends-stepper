import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendFeedbackService {

  public loading = new BehaviorSubject<boolean>(false);
  public successMessage = new BehaviorSubject<string>(null);
  public infoMessage = new BehaviorSubject<string>(null);
  public alertMessage = new BehaviorSubject<string>(null);
  public errorMessage = new BehaviorSubject<string>(null);

  private timeShowMessage = 10000;

  constructor(
    private router: Router,
  ) { }

  showLoading() {
    this.loading.next(true);
  }

  hideLoading() {
    this.loading.next(false);
  }

  showSuccessMessage(message: string) {
    this.successMessage.next(message);
    return timer(this.timeShowMessage)
      .pipe(
        tap(() => this.hideSuccessMessage())
      );
  }

  hideSuccessMessage() {
    this.successMessage.next(null);
  }

  showInfoMessage(message: string) {
    this.infoMessage.next(message);
    return timer(this.timeShowMessage)
      .pipe(
        tap(() => this.hideInfoMessage())
      );
  }

  hideInfoMessage() {
    this.infoMessage.next(null);
  }

  showAlertMessage(message: string) {
    this.alertMessage.next(message);
    return timer(this.timeShowMessage)
      .pipe(
        tap(() => this.hideAlertMessage())
      );
  }

  hideAlertMessage() {
    this.alertMessage.next(null);
  }

  showErrorMessage(message: string) {
    this.errorMessage.next(message);
    return timer(this.timeShowMessage)
      .pipe(
        tap(() => this.hideErrorMessage())
      );
  }

  hideErrorMessage() {
    this.errorMessage.next(null);
  }

  handleError(error) {

    switch (error.status) {
      case 404:
        this.router.navigate(['not-found']);
        break;
      default:
        this.router.navigate(['error']);
        break;
    }

    return of(false);
  }
}
