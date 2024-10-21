import { NgModule } from '@angular/core';
import { ReceptionFormComponent } from './components/reception-form.component';
import { ReceptionFormRoutingModule } from './reception-form-routing.module';
import { SharedModule } from '../../shared/shared.modulo';

@NgModule({
  declarations: [
    ReceptionFormComponent
  ],
  imports: [
    ReceptionFormRoutingModule,
    SharedModule
  ]
})
export class ReceptionFormModule { }
