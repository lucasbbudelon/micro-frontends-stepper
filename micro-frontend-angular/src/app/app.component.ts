import { Component, OnInit } from '@angular/core';
import { tap, } from 'rxjs/operators';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public process;

  constructor(
    private appService: AppService
  ) {

  }

  ngOnInit() {
    this.appService.getProcess('123')
      .pipe(tap(process => this.process = process))
      .subscribe();
  }

  save() {
    this.appService.save(this.process);
  }
}
