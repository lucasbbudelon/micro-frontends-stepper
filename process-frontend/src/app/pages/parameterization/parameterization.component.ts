import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Step } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';
import { ActivatedRoute } from '@angular/router';
import { tap, flatMap, finalize } from 'rxjs/operators';
import { timer, Observable } from 'rxjs';
import { BackendFeedbackService } from 'src/app/components/backend-feedback/backend-feedback.service';

@Component({
  selector: 'app-parameterization',
  templateUrl: './parameterization.component.html',
  styleUrls: ['./parameterization.component.scss']
})
export class ParameterizationComponent implements OnInit {

  public step: Step;
  public url: SafeResourceUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private backendFeedbackService: BackendFeedbackService,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.processService
      .getCurrent()
      .pipe(
        tap((process) => {
          const currentRouter = this.activatedRoute.routeConfig.path;
          const step = process.steps.find(s => s.codeName === currentRouter);
          const url = `${step.url}?process=${process.id}`;
          this.step = step;
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.processService.waitOpeningStep(step);
        })
      )
      .subscribe();
  }
}
