import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuditoriesTestPageRoutingModule } from './auditories-test-routing.module';

import { AuditoriesTestPage } from './auditories-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuditoriesTestPageRoutingModule
  ],
  declarations: [AuditoriesTestPage]
})
export class AuditoriesTestPageModule {}
