import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverPagePage } from './popover-page.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverPagePageRoutingModule {}
