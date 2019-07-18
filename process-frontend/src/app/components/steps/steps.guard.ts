import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, flatMap } from 'rxjs/operators';
import { Process } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';
import { BackendFeedbackService } from '../backend-feedback/backend-feedback.service';

@Injectable({
  providedIn: 'root'
})
export class StepsGuard implements CanActivate {

  constructor(
    private backendFeedbackService: BackendFeedbackService,
    private processService: ProcessService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const currentRouter = next.routeConfig.path;

    this.backendFeedbackService.showLoading();

    return this.processService.getCurrent()
      .pipe(
        flatMap(process => this.updateLastAcess(process, currentRouter)),
        catchError(error => this.backendFeedbackService.handleError(error)),
        finalize(() => this.backendFeedbackService.showLoading())
      );
  }

  updateLastAcess(process: Process, codeNameStep: string) {
    const step = this.processService.getStep(process, codeNameStep);
    step.lastAcess = new Date();
    return this.processService
      .patch(step)
      .pipe(
        flatMap(() => of(true)),
        catchError(() => of(false))
      );
  }
}
