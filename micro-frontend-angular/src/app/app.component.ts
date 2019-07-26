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
    this.initOnkeydown();
    this.loadProcess();
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

  private loadProcess() {
    const processId = window.location.search.split('=')[1];
    if (!processId) { return; }
    this.appService.getProcess(processId)
      .pipe(
        tap(process => this.loadData(process))
      )
      .subscribe();
  }

  private loadData(process) {
    this.stepCodeName = 'promotional-package';
    this.currentProcess = process;
    this.currentStep = process.steps.find(f => f.codeName === this.stepCodeName);
    this.fieldStep = this.currentStep.fields.find(s => s.codeName === 'package-code');
    this.appService.emitStepRendered(process.id, this.stepCodeName);
  }

  private initOnkeydown() {
    document.onkeydown = (e) => {

      if (e.ctrlKey) { return; }

      const indexItemSelected = this.getItemSelected();
      let newItemSelected;

      switch (e.key) {
        case 'Enter':
          if (!this.fieldStep.value) { return; }
          this.submit();
          break;
        case 'ArrowLeft':
          newItemSelected = this.items[indexItemSelected - 1];
          break;
        case 'ArrowRight':
          newItemSelected = this.items[indexItemSelected + 1];
          break;
        default:
          break;
      }

      if (!newItemSelected) { newItemSelected = this.items[indexItemSelected]; }
      if (indexItemSelected < 0) { newItemSelected = this.items[0]; }
      this.fieldStep.value = newItemSelected.code;
    };
  }

  private getItemSelected() {
    const itemSelected = this.items.find(x => x.code === this.fieldStep.value);
    return this.items.indexOf(itemSelected);
  }
}
