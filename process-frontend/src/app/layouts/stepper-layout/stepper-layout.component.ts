import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Process } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-stepper-layout',
  templateUrl: './stepper-layout.component.html',
  styleUrls: ['./stepper-layout.component.scss']
})
export class StepperLayoutComponent implements OnInit {

  public process: Process;

  constructor(
    private activatedRoute: ActivatedRoute,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.processService.current
      .pipe(
        filter(process => Boolean(process)),
        tap(process => this.process = process)
      )
      .subscribe();
  }

  // back() {
  //   const currentRouter = this.activatedRoute.routeConfig.path;
  //   this.processService
  //     .getCurrent()
  //     .pipe(
  //       flatMap(process => this.processService.backStep(process, currentRouter))
  //     )
  //     .subscribe();
  // }

  // next() {
  //   const currentRouter = this.activatedRoute.routeConfig.path;
  //   this.processService
  //     .getCurrent()
  //     .pipe(
  //       flatMap(process => this.processService.nextStep(process, currentRouter))
  //     )
  //     .subscribe();
  // }
}
