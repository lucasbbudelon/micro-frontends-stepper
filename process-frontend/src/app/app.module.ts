import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackendFeedbackComponent } from './components/backend-feedback/backend-feedback.component';
import { BackendFeedbackService } from './components/backend-feedback/backend-feedback.service';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { StepsComponent } from './components/steps/steps.component';
import { MessengerService } from './core/messenger/messenger.service';
import { ProcessService } from './core/process/process.service';
import { StepperLayoutComponent } from './layouts/stepper-layout/stepper-layout.component';
import { ContractComponent } from './pages/contract/contract.component';
import { DefaultPageComponent } from './pages/default-page/default-page.component';
import { DynamicFormComponent } from './pages/dynamic-form/dynamic-form.component';
import { ListComponent } from './pages/list/list.component';
import { ParameterizationComponent } from './pages/parameterization/parameterization.component';
import { ProcessComponent } from './pages/process/process.component';
import { FinishComponent } from './pages/finish/finish.component';

@NgModule({
  declarations: [
    AppComponent,
    ProcessComponent,
    DynamicFormComponent,
    ParameterizationComponent,
    ContractComponent,
    StepsComponent,
    ProgressBarComponent,
    BackendFeedbackComponent,
    ListComponent,
    StepperLayoutComponent,
    DefaultPageComponent,
    FinishComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    SocketIoModule.forRoot({ url: environment.messenger, options: {} })
  ],
  providers: [
    BackendFeedbackService,
    ProcessService,
    MessengerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
