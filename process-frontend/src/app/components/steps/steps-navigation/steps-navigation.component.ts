import { Component, OnInit } from '@angular/core';
import { ProcessService } from 'src/app/core/process/process.service';
import { ActivatedRoute } from '@angular/router';

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
    this.processService
      .backStep(this.activatedRoute.routeConfig.path)
      .subscribe();
  }

  next() {
    this.processService
      .nextStep(this.activatedRoute.routeConfig.path)
      .subscribe();
  }
}
