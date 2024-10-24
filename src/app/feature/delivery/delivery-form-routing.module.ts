import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryFormComponent } from './components/delivery-form/delivery-form.component';
import { SignatureComponent } from '../delivery/components/signature/signature.component';
import { WebcamComponent } from '../delivery/components/webcam/webcam.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, 
    children: [
      {
        path: 'registro-entrega/:id', component: DeliveryFormComponent
      },
      {
        path: 'tomar-foto', component: WebcamComponent
      },
      {
        path: 'tomar-firma', component: SignatureComponent
      }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DeliveryFormRoutingModule { }
