import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss']
})
export class DefaultPageComponent implements OnInit {

  public title: string;
  public icon: string;
  public text: string;

  constructor(
    public activatedRoute: ActivatedRoute,
  ) {


  }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        tap((value) => {
          this.title = value.title;
          this.title = value.icon;
          this.text = value.text;
        })
      )
      .subscribe();
  }
}
