import { NgModule } from '@angular/core';
import { DeliveryFormComponent } from './components/delivery-form/delivery-form.component';
import { DeliveryFormRoutingModule } from './delivery-form-routing.module'; 
import {WebcamModule} from 'ngx-webcam';
import { WebcamComponent } from './components/webcam/webcam.component';
import { SignatureComponent } from './components/signature/signature.component';

@NgModule({
  declarations: [
    DeliveryFormComponent,
    WebcamComponent,
    SignatureComponent
  ],
  imports: [
    DeliveryFormRoutingModule,
    WebcamModule
  ]
})
export class DeliveryFormModule { }
