import { Component, OnInit } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { ProcessService } from '../../core/process/process.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  public percentage = 0;

  constructor(
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.processService.current
      .pipe(
        filter(process => Boolean(process)),
        tap((process) => {
          const total = process.steps.length;
          const completed = process.steps.filter(s => s.completed).length;
          this.percentage = Math.round((completed / total) * 100);
        })
      )
      .subscribe();
  }
}
