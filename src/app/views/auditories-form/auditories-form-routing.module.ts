import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditoriesFormPage } from './auditories-form.page';

const routes: Routes = [
  {
    path: '',
    component: AuditoriesFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditoriesFormPageRoutingModule {}
