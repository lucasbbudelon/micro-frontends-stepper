import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Step } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

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
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.processService
      .getCurrent()
      .pipe(
        tap((process) => {
          const currentRouter = this.activatedRoute.routeConfig.path;
          this.step = this.processService.getStep(process, currentRouter);
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.step.url);
        })
      )
      .subscribe();
  }
}
