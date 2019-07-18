import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, filter, distinctUntilChanged } from 'rxjs/operators';
import { Step, Process } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  public step: Step;

  constructor(
    private activatedRoute: ActivatedRoute,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.processService.getCurrent()
      .pipe(
        tap(process => this.loadStep(process))
      )
      .subscribe();

    this.processService.current
      .pipe(
        distinctUntilChanged(),
        filter(process => Boolean(process)),
        tap(process => this.loadStep(process))
      )
      .subscribe();
  }

  submit() {
    this.processService
      .save(this.step)
      .subscribe();
  }

  private loadStep(process: Process) {
    const codeName = this.activatedRoute.snapshot.routeConfig.path;
    this.step = process.steps.find(s => s.codeName === codeName);
  }
}
