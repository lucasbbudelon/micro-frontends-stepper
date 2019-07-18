import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendFeedbackService {

  constructor(
    private router: Router,
  ) { }

  showLoading() {

  }

  hideLoading() {

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
