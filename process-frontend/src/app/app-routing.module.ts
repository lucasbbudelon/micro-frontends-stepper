import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepsGuard } from './components/steps/steps.guard';
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
    path: 'document',
    component: DynamicFormComponent,
    canActivate: [StepsGuard]
  },
  {
    path: 'basic-data',
    component: DynamicFormComponent,
    canActivate: [StepsGuard]
  },
  {
    path: 'address',
    component: DynamicFormComponent,
    canActivate: [StepsGuard]
  },
  {
    path: 'professional-data',
    component: ParameterizationComponent,
    canActivate: [StepsGuard]
  },
  {
    path: 'academic-data',
    component: ParameterizationComponent,
    canActivate: [StepsGuard]
  },
  {
    path: 'contract',
    component: ContractComponent,
    canActivate: [StepsGuard]
  },
  {
    path: 'finalization',
    component: FinalizationComponent,
    canActivate: [StepsGuard]
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
