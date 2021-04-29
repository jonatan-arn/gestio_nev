import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormulariPage } from './formulari.page';

const routes: Routes = [
  {
    path: '',
    component: FormulariPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormulariPageRoutingModule {}
