import { NgModule } from '@angular/core';
import { DeliveryFormComponent } from './components/delivery-form/delivery-form.component';
import { DeliveryFormRoutingModule } from './delivery-form-routing.module'; 
import {WebcamModule} from 'ngx-webcam';
import { WebcamComponent } from './components/webcam/webcam.component';
import { SignatureComponent } from './components/signature/signature.component';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    DeliveryFormComponent,
    WebcamComponent,
    SignatureComponent,
    DashboardComponent
  ],
  imports: [
    DeliveryFormRoutingModule,
    WebcamModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class DeliveryFormModule { }
