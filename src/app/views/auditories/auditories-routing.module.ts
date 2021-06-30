import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditoriesPage } from './auditories.page';

const routes: Routes = [
  {
    path: '',
    component: AuditoriesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditoriesPageRoutingModule {}
