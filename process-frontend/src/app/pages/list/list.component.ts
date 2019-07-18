import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { MessengerService } from 'src/app/core/messenger/messenger.service';
import { Process } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

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
