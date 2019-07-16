import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ProcessService } from './process.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessGuard implements CanActivate {

  constructor(
    private router: Router,
    private processService: ProcessService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.processService.handleChangeRouter(next.routeConfig.path);
    return true;
  }
}
