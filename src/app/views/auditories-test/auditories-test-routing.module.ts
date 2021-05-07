import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditoriesTestPage } from './auditories-test.page';

const routes: Routes = [
  {
    path: '',
    component: AuditoriesTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditoriesTestPageRoutingModule {}
