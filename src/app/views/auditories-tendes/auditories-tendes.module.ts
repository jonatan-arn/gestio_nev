import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuditoriesTendesPageRoutingModule } from './auditories-tendes-routing.module';

import { AuditoriesTendesPage } from './auditories-tendes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuditoriesTendesPageRoutingModule
  ],
  declarations: [AuditoriesTendesPage]
})
export class AuditoriesTendesPageModule {}
