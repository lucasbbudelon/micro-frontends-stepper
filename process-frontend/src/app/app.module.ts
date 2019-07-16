import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StepsNavigationComponent } from './components/steps/steps-navigation/steps-navigation.component';
import { StepsComponent } from './components/steps/steps.component';
import { MessengerService } from './core/messenger/messenger.service';
import { ProcessService } from './core/process/process.service';
import { AddressComponent } from './pages/address/address.component';
import { BasicDataComponent } from './pages/basic-data/basic-data.component';
import { ContractComponent } from './pages/contract/contract.component';
import { CustomizationComponent } from './pages/customization/customization.component';
import { DocumentComponent } from './pages/document/document.component';
import { ErrorComponent } from './pages/error/error.component';
import { FinalizationComponent } from './pages/finalization/finalization.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProcessComponent } from './pages/process/process.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    DocumentComponent,
    BasicDataComponent,
    AddressComponent,
    ContractComponent,
    FinalizationComponent,
    NotFoundComponent,
    ErrorComponent,
    StepsComponent,
    ProcessComponent,
    CustomizationComponent,
    StepsNavigationComponent,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot({ url: environment.messenger, options: {} })
  ],
  providers: [
    ProcessService,
    MessengerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
