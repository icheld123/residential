import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptionFormComponent } from './components/reception-form.component';

const routes: Routes = [
  {
    path: '', component: ReceptionFormComponent,
    children: []
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ReceptionFormRoutingModule { }
