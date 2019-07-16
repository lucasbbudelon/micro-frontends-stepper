import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { MessengerService } from 'src/app/core/messenger/messenger.service';
import { Process } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {

  public processes: Process[];

  constructor(
    private messengerService: MessengerService,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.getAllProcess();
    this.messengerService
      .changeProcessListening()
      .pipe(tap(() => this.getAllProcess()))
      .subscribe();
  }

  add() {
    this.processService
      .post()
      .subscribe();
  }

  private getAllProcess() {
    this.processService
      .getAll()
      .pipe(tap(processes => this.processes = processes))
      .subscribe();
  }
}
