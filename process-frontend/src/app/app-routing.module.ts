import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepperLayoutComponent } from './layouts/stepper-layout/stepper-layout.component';
import { ContractComponent } from './pages/contract/contract.component';
import { DynamicFormComponent } from './pages/dynamic-form/dynamic-form.component';
import { ErrorComponent } from './pages/error/error.component';
import { FinalizationComponent } from './pages/finalization/finalization.component';
import { ListComponent } from './pages/list/list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ParameterizationComponent } from './pages/parameterization/parameterization.component';
import { ProcessComponent } from './pages/process/process.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'process',
    component: ProcessComponent
  },

  {
    path: 'process/:processId',
    component: StepperLayoutComponent,
    children: [
      {
        path: 'current-step',
        component: ProcessComponent
      },
      {
        path: 'document',
        component: DynamicFormComponent
      },
      {
        path: 'basic-data',
        component: DynamicFormComponent
      },
      {
        path: 'address',
        component: DynamicFormComponent
      },
      {
        path: 'professional-data',
        component: ParameterizationComponent
      },
      {
        path: 'academic-data',
        component: ParameterizationComponent
      },
      {
        path: 'contract',
        component: ContractComponent
      }
    ]
  },
  {
    path: 'finalization',
    component: FinalizationComponent
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
