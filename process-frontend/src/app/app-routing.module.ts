import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessGuard } from './core/process/process.guard';
import { AddressComponent } from './pages/address/address.component';
import { BasicDataComponent } from './pages/basic-data/basic-data.component';
import { ContractComponent } from './pages/contract/contract.component';
import { CustomizationComponent } from './pages/customization/customization.component';
import { DocumentComponent } from './pages/document/document.component';
import { ErrorComponent } from './pages/error/error.component';
import { FinalizationComponent } from './pages/finalization/finalization.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProcessComponent } from './pages/process/process.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'process',
    pathMatch: 'full'
  },
  {
    path: 'process',
    component: ProcessComponent,
    canActivate: [ProcessGuard]
  },
  {
    path: 'document',
    component: DocumentComponent,
    canActivate: [ProcessGuard]
  },
  {
    path: 'basic-data',
    component: BasicDataComponent,
    canActivate: [ProcessGuard]
  },
  {
    path: 'address',
    component: AddressComponent,
    canActivate: [ProcessGuard]
  },
  {
    path: 'professional-data',
    component: CustomizationComponent,
    canActivate: [ProcessGuard]
  },
  {
    path: 'academic-data',
    component: CustomizationComponent,
    canActivate: [ProcessGuard]
  },
  {
    path: 'contract',
    component: ContractComponent,
    canActivate: [ProcessGuard]
  },
  {
    path: 'finalization',
    component: FinalizationComponent,
    canActivate: [ProcessGuard]
  },


  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
