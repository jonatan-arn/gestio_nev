import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuditoriesPageRoutingModule } from './auditories-routing.module';

import { AuditoriesPage } from './auditories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuditoriesPageRoutingModule
  ],
  declarations: [AuditoriesPage]
})
export class AuditoriesPageModule {}
