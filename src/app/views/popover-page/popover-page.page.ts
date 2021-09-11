import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { auditories } from 'src/app/models/BM_Auditories';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { AuditoriesFormPage } from '../auditories-form/auditories-form.page';

@Component({
  selector: 'app-popover-page',
  templateUrl: './popover-page.page.html',
  styleUrls: ['./popover-page.page.scss'],
})
export class PopoverPagePage implements OnInit {
  @Input() aud: auditories;
  constructor(
    private auditoriaService: AuditoriesService,
    private popoverCtrl: PopoverController,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  borrar() {
    this.auditoriaService.onDelete(this.aud.BM_id, 'BM_Auditories');
    let p = this.auditoriaService.getPreguntesbyIdAudutoria(this.aud.BM_id);
    p.forEach((res) => {
      res.forEach((pregunta) => {
        console.log(pregunta);
        this.auditoriaService
          .onDelete(pregunta.BM_id, 'BM_PreguntesCreades')
          .then(
            () => console.log('pregunta borrada'),
            () => console.log('pregunta no borrada')
          );
        this.auditoriaService.onDelete(pregunta.BM_id, 'BM_Checkbox').then(
          () => console.log('BM_Checkbox borrada'),
          () => console.log('BM_Checkbox no borrada')
        );
        this.auditoriaService.onDelete(pregunta.BM_id, 'BM_Radio').then(
          () => console.log('BM_Radio borrada'),
          () => console.log('BM_Radio no borrada')
        );
        this.auditoriaService.onDelete(pregunta.BM_id, 'BM_Text').then(
          () => console.log('BM_Text borrada'),
          () => console.log('BM_Text no borrada')
        );
        this.auditoriaService.onDelete(pregunta.BM_id, 'BM_Numero').then(
          () => console.log('BM_Numero borrada'),
          () => console.log('BM_Numero no borrada')
        );
        this.auditoriaService.onDelete(pregunta.BM_id, 'BM_Slider').then(
          () => console.log('BM_Slider borrada'),
          () => console.log('BM_Slider no borrada')
        );
        this.auditoriaService.onDelete(pregunta.BM_id, 'BM_Smile').then(
          () => console.log('Smile borrada'),
          () => console.log('Smile no borrada')
        );
        this.auditoriaService.onDelete(pregunta.BM_id, 'BM_SiNo').then(
          () => console.log('SiNO borrada'),
          () => console.log('SiNO no borrada')
        );
      });
    });

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
    this.popoverCtrl.dismiss();
  }
  async alerta(s) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: s,
      buttons: [{ text: 'No' }, { text: 'Si', handler: () => this.borrar() }],
    });

    await alert.present();
  }
  borrarAll() {}
}
