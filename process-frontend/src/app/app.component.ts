import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { MessengerService } from './core/messenger/messenger.service';
import { ProcessService } from './core/process/process.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public block: boolean;

  constructor(
    private messengerService: MessengerService,
    private processService: ProcessService
  ) { }

  ngOnInit() {

    // this.messengerService.nextStepListening()
    //   .pipe(tap(process => this.processService.handleNextStep(process)))
    //   .subscribe();

    // this.messengerService.backStepListening()
    //   .pipe(tap(process => this.processService.handleBackStep(process)))
    //   .subscribe();

    // this.messengerService.blockProcessListening()
    //   .pipe(tap(() => this.block = true))
    //   .subscribe();

    // this.processService.keepProcess();
  }
}
