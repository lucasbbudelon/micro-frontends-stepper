import { Component, OnInit } from '@angular/core';
import { tap, flatMap } from 'rxjs/operators';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public currentProcess;
  public currentStep;
  public fieldStep;
  public packages = [
    {
      code: 'small',
      title: 'Pequeno',
      price: 12.5,
      image: 'https://staynalivenew.files.wordpress.com/2013/06/2e7d1-brown-paper-package.png',
      selected: false
    },
    {
      code: 'medium',
      title: 'Médio',
      price: 19.9,
      image: 'https://www.iupui.edu/~santedit/sant/wp-content/uploads/2015/05/brown_paper_packages_tied_up_with_strings.jpg',
      selected: false
    },
    {
      code: 'large',
      title: 'Grande',
      price: 29.9,
      image: 'https://www.freeiconspng.com/uploads/packages-icon-12.jpg',
      selected: false
    }
  ];

  constructor(
    private appService: AppService
  ) {

  }

  ngOnInit() {

    const processId = window.location.search.split('=')[1];

    if (!processId) { return; }

    this.appService.getProcess(processId)
      .pipe(
        tap(process => this.loadData(process)),
        flatMap(() => this.updateLastAcess())
      )
      .subscribe();
  }

  selectPackage(code: string) {
    this.fieldStep.value = code;
  }

  submit() {
    this.currentStep.lastUpdate = new Date();
    this.appService
      .saveStep(this.currentProcess, this.currentStep, { warnChange: true, moveNextStep: true })
      .subscribe();
  }

  private loadData(process) {
    this.currentProcess = process;
    this.currentStep = process.steps.find(f => f.codeName === 'promotional-package');
    this.fieldStep = this.currentStep.fields.find(s => s.codeName === 'package-code');
  }

  private updateLastAcess() {
    this.currentStep.lastAcess = new Date();
    return this.appService
      .saveStep(this.currentProcess, this.currentStep, { warnChange: true });
  }
}
