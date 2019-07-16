import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Step } from 'src/app/core/process/process.model';
import { ProcessService } from 'src/app/core/process/process.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customization',
  templateUrl: './customization.component.html',
  styleUrls: ['./customization.component.scss']
})
export class CustomizationComponent implements OnInit {

  public step: Step;
  public url: SafeResourceUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.step = this.processService.getStepByCurrentProcess(this.activatedRoute.routeConfig.path);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.step.url);
  }
}
