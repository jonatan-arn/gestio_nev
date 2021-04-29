import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormulariPageRoutingModule } from './formulari-routing.module';

import { FormulariPage } from './formulari.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, FormulariPageRoutingModule],
  declarations: [FormulariPage],
  providers: [{ provide: LOCALE_ID, useValue: 'es-EA' }],
})
export class FormulariPageModule {}
