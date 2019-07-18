import { Component, OnInit } from '@angular/core';
import { ProcessService } from 'src/app/core/process/process.service';
import { ActivatedRoute } from '@angular/router';
import { tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-steps-navigation',
  templateUrl: './steps-navigation.component.html',
  styleUrls: ['./steps-navigation.component.scss']
})
export class StepsNavigationComponent implements OnInit {


  constructor(
    private activatedRoute: ActivatedRoute,
    private processService: ProcessService
  ) { }

  ngOnInit() {

  }

  back() {
    const currentRouter = this.activatedRoute.routeConfig.path;
    this.processService
      .getCurrent()
      .pipe(
        flatMap(process => this.processService.backStep(process, currentRouter))
      )
      .subscribe();
  }

  next() {
    const currentRouter = this.activatedRoute.routeConfig.path;
    this.processService
      .getCurrent()
      .pipe(
        flatMap(process => this.processService.nextStep(process, currentRouter))
      )
      .subscribe();
  }
}
