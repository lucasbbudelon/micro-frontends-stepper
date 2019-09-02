import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { ProcessService } from '../../core/process/process.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {

  public percentage = 0;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.processService.current
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(process => Boolean(process)),
        tap((process) => {
          const total = process.steps.length;
          const completed = process.steps.filter(s => s.completed).length;
          this.percentage = Math.round((completed / total) * 100);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
