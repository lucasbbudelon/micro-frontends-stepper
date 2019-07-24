import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, tap, flatMap, finalize } from 'rxjs/operators';
import { Process } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';
import { timer } from 'rxjs';
import { BackendFeedbackService } from 'src/app/components/backend-feedback/backend-feedback.service';

@Component({
  selector: 'app-stepper-layout',
  templateUrl: './stepper-layout.component.html',
  styleUrls: ['./stepper-layout.component.scss']
})
export class StepperLayoutComponent implements OnInit {

  public process: Process;

  constructor(
    private activatedRoute: ActivatedRoute,
    private backendFeedbackService: BackendFeedbackService,
    private processService: ProcessService
  ) { }

  ngOnInit() {

    this.initOnkeydown();

    this.processService.getCurrent(this.activatedRoute)
      .pipe(
        tap(process => this.process = process)
      )
      .subscribe();

    this.processService.current
      .pipe(
        filter(process => Boolean(process)),
        tap(process => this.process = process)
      )
      .subscribe();
  }

  next() {
    this.processService.navigateToStep(this.process, this.process.nextStep);
  }

  back() {
    this.processService.navigateToStep(this.process, this.process.backStep);
  }

  private initOnkeydown() {
    document.onkeydown = (e) => {

      if (!e.ctrlKey) { return; }

      switch (e.key) {
        case 'ArrowLeft':
          this.back();
          break;
        case 'ArrowRight':
          this.next();
          break;
        default:
          break;
      }
    };
  }
}
