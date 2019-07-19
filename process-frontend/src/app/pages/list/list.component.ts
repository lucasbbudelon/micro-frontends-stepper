import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
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
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.processService
      .getAll()
      .subscribe();

    this.processService.all
      .pipe(tap(processes => this.processes = processes))
      .subscribe();
  }

  add() {
    this.processService
      .post()
      .subscribe();
  }
}
