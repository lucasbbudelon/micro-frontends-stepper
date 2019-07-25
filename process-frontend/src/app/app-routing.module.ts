import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepperLayoutComponent } from './layouts/stepper-layout/stepper-layout.component';
import { ContractComponent } from './pages/contract/contract.component';
import { DefaultPageComponent } from './pages/default-page/default-page.component';
import { DynamicFormComponent } from './pages/dynamic-form/dynamic-form.component';
import { FinishComponent } from './pages/finish/finish.component';
import { ListComponent } from './pages/list/list.component';
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
        path: 'promotional-package',
        component: ParameterizationComponent
      },
      {
        path: 'time-experience',
        component: ParameterizationComponent
      },
      {
        path: 'contract',
        component: ContractComponent
      },
      {
        path: 'finish',
        component: FinishComponent
      }
    ]
  },
  {
    path: 'not-found',
    component: DefaultPageComponent,
    data: {
      title: 'Recurso não encontrado!',
      icon: 'search-minus',
      text: 'Desculpe, mas não foi possível localizar este recurso.',
    }
  },
  {
    path: '**',
    component: DefaultPageComponent,
    data: {
      title: 'Ops, ocorreu um erro!',
      icon: 'exclamation-triangle',
      text: 'Desculpe, mas ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
