import { Component, OnInit } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { Process, Step } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {

  public process: Process;
  public steps: Step[];

  constructor(
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.processService.current
      .pipe(
        filter(process => Boolean(process)),
        tap((process) => {
          this.process = process;
          this.steps = process.steps.sort((a, b) => a.order - b.order);
        })
      )
      .subscribe();
  }
}
