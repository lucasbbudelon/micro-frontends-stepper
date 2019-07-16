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

  public newConnection: string;
  public block: boolean;

  constructor(
    private messengerService: MessengerService,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.messengerService.newConnectionsListening()
      .pipe(
        tap((newConnection) => {
          this.newConnection = newConnection;
          setTimeout(() => {
            this.newConnection = null;
          }, 5000);
        })
      )
      .subscribe();

    // this.messengerService.changeProcessListening()
    //   .pipe(tap(process => this.processService.handleChangeProcess(process)))
    //   .subscribe();

    this.messengerService.nextStepListening()
      .pipe(tap(process => this.processService.handleNextStep(process)))
      .subscribe();

    this.messengerService.backStepListening()
      .pipe(tap(process => this.processService.handleBackStep(process)))
      .subscribe();



    this.messengerService.blockProcessListening()
      .pipe(tap(() => this.block = true))
      .subscribe();

    this.messengerService.blockProcessListening()
      .pipe(tap(() => this.block = false))
      .subscribe();

    this.processService.keepProcess();
  }
}
