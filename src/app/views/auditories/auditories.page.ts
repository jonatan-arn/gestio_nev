import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  MenuController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { auditories } from 'src/app/models/BM_Auditories';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { AuditoriesFormPage } from '../auditories-form/auditories-form.page';
import { PopoverPagePage } from '../popover-page/popover-page.page';

@Component({
  selector: 'app-auditories',
  templateUrl: './auditories.page.html',
  styleUrls: ['./auditories.page.scss'],
})
export class AuditoriesPage implements OnInit {
  auditories$ = this.auditoriaService.auditorias;
  constructor(
    private menu: MenuController,
    private auditoriaService: AuditoriesService,
    private modalController: ModalController,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.menu.enable(true);
  }
  openMenu() {
    this.menu.toggle();
  }
  async openAuditoria() {
    const modal = await this.modalController.create({
      component: AuditoriesFormPage,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }
  async optionAudiotoria(event, auditoria) {
    const popover = await this.popoverController.create({
      component: PopoverPagePage,
      cssClass: 'my-custom-class',
      event: event,
      translucent: true,
      componentProps: { aud: auditoria },
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
