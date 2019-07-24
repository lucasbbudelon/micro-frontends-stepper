import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import * as constants from './app.constants';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public stepCodeName;
  public currentProcess;
  public currentStep;
  public fieldStep;
  public items = constants.ITEMS;

  constructor(
    private appService: AppService
  ) {

  }

  ngOnInit() {

    const processId = window.location.search.split('=')[1];

    if (!processId) { return; }

    this.appService.getProcess(processId)
      .pipe(
        tap(process => this.loadData(process))
      )
      .subscribe();
  }

  selectItem(code: string) {
    this.fieldStep.value = code;
  }

  submit() {
    this.currentStep.lastUpdate = new Date();
    this.appService
      .saveStep(this.currentProcess, this.currentStep, { warnChange: true, moveNextStep: true })
      .subscribe();
  }

  private loadData(process) {
    this.stepCodeName = 'promotional-package';
    this.currentProcess = process;
    this.currentStep = process.steps.find(f => f.codeName === this.stepCodeName);
    this.fieldStep = this.currentStep.fields.find(s => s.codeName === 'package-code');
    this.appService.emitStepRendered(process.id, this.stepCodeName);
  }
}
