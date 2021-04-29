import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuditoriesFormPageRoutingModule } from './auditories-form-routing.module';

import { AuditoriesFormPage } from './auditories-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuditoriesFormPageRoutingModule
  ],
  declarations: [AuditoriesFormPage]
})
export class AuditoriesFormPageModule {}
