import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Process, Step } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit, OnDestroy {

  public process: Process;
  public steps: Step[];

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
          this.process = process;
          this.steps = process.steps.sort((a, b) => a.order - b.order);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
