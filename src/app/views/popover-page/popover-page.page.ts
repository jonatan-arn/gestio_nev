import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { AuditoriesFormPage } from '../auditories-form/auditories-form.page';

@Component({
  selector: 'app-popover-page',
  templateUrl: './popover-page.page.html',
  styleUrls: ['./popover-page.page.scss'],
})
export class PopoverPagePage implements OnInit {
  @Input() aud;
  constructor(
    private auditoriaService: AuditoriesService,
    private popoverCtrl: PopoverController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}
  borrar() {
    this.auditoriaService.onDeleteAuditoria(this.aud);
    this.popoverCtrl.dismiss();
  }
  async modificar() {
    const modal = await this.modalController.create({
      component: AuditoriesFormPage,
      cssClass: 'my-custom-class',
      componentProps: {
        aud: this.aud,
        edit: true,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }
}
