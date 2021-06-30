import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditoriesTendesPage } from './auditories-tendes.page';

const routes: Routes = [
  {
    path: '',
    component: AuditoriesTendesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditoriesTendesPageRoutingModule {}
