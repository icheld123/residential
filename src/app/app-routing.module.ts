import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent },
  { path: 'registro-recepcion',
    loadChildren: () =>
      import('./feature/reception-form/reception-form.module').then(
        (mod) => mod.ReceptionFormModule
      ),
   },
  { path: 'paquetes',
    loadChildren: () =>
      import('./feature/delivery/delivery-form.module').then(
        (mod) => mod.DeliveryFormModule
      )
   },
   { path: '**', redirectTo: '/inicio'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
