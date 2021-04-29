import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  MenuController,
  ModalController,
} from '@ionic/angular';
import { NuevoAuditoria } from 'src/app/models/BM_Auditories';
import { checkbox } from 'src/app/models/BM_checkbox';
import { numero } from 'src/app/models/BM_numero';
import { radio } from 'src/app/models/BM_Radio';
import { si_no } from 'src/app/models/BM_si_no';
import { slider } from 'src/app/models/BM_slider';
import { smile } from 'src/app/models/BM_smile';
import { text } from 'src/app/models/BM_text';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { preguntaCreacio } from '../../models/BM_PreguntaCreacio';
import { PreguntaPage } from '../pregunta/pregunta.page';

@Component({
  selector: 'app-auditories-form',
  templateUrl: './auditories-form.page.html',
  styleUrls: ['./auditories-form.page.scss'],
})
export class AuditoriesFormPage implements OnInit {
  id: string;
  nom: string;
  preguntes: preguntaCreacio[] = [];
  checkbox: checkbox[] = [];
  radiobutton: radio[] = [];
  text: text[] = [];
  numeros: numero[] = [];
  smile: smile[] = [];
  slider: slider[] = [];
  si_no: si_no[] = [];

  constructor(
    public actionSheetController: ActionSheetController,
    private menu: MenuController,
    private modalController: ModalController,
    private alertController: AlertController,
    private AuditoriesService: AuditoriesService
  ) {}

  ngOnInit() {}
  async openPregunta() {
    if (this.id == undefined) {
      this.alerta('Error el id de la auditoria se tiene que introducir');
    } else {
      const actionSheet = await this.actionSheetController.create({
        cssClass: 'my-custom-class',
        buttons: [
          {
            text: 'Seleccionar varios',
            icon: 'checkbox-outline',
            handler: () => {
              this.presentModal('checkbox');
            },
          },
          {
            text: 'Seleccionar una',
            icon: 'radio-button-on-outline',
            handler: () => {
              this.presentModal('radiobutton');
            },
          },
          {
            text: 'Pregunta de texto',
            icon: 'document-text-outline',
            handler: () => {
              this.presentModal('text');
            },
          },
          {
            text: 'Slider numero',
            icon: 'options-outline',
            handler: () => {
              this.presentModal('SliderNumero');
            },
          },
          {
            text: 'Slider icono',
            icon: 'options-outline',
            handler: () => {
              this.presentModal('sliderIcono');
            },
          },
          {
            text: 'Si/No',
            icon: 'heart',
            handler: () => {
              this.presentModal('si/no');
            },
          },
          {
            text: 'Numero',
            icon: 'heart',
            handler: () => {
              this.presentModal('numero');
            },
          },
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
          },
        ],
      });
      await actionSheet.present();
    }
  }
  async presentModal(type) {
    const modal = await this.modalController.create({
      component: PreguntaPage,
      cssClass: 'my-custom-class',
      componentProps: {
        tipo: type,
        auditoriaID: this.id,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data.r instanceof checkbox) this.checkbox.push(data.r);
    else if (data.r instanceof radio) this.radiobutton.push(data.r);
    else if (data.r instanceof slider) this.slider.push(data.r);
    else if (data.r instanceof smile) this.smile.push(data.r);
    else if (data.r instanceof si_no) this.si_no.push(data.r);
    else if (data.r instanceof numero) this.numeros.push(data.r);
    else if (data.r instanceof text) this.text.push(data.r);
    let p: preguntaCreacio = data.p;
    this.preguntes.push(p);
  }
  openMenu() {
    this.menu.toggle();
  }
  async alerta(s) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: s,
      buttons: ['OK'],
    });

    await alert.present();
  }
  guardar() {
    if (this.checkbox.length != 0) {
      for (let box of this.checkbox) {
        this.AuditoriesService.put(box, 'BM_Checkbox/');
      }
    }
    if (this.radiobutton.length != 0) {
      for (let radio of this.radiobutton) {
        this.AuditoriesService.put(radio, 'BM_Radio/');
      }
    }
    if (this.text.length != 0) {
      for (let tex of this.text) {
        this.AuditoriesService.put(tex, 'BM_Text/');
      }
    }
    if (this.numeros.length != 0) {
      for (let n of this.numeros) {
        this.AuditoriesService.put(n, 'BM_Numero/');
      }
    }
    if (this.slider.length != 0) {
      for (let sli of this.slider) {
        this.AuditoriesService.put(sli, 'BM_Slider/');
      }
    }
    if (this.smile.length != 0) {
      for (let sml of this.smile) {
        this.AuditoriesService.put(sml, 'BM_Smile/');
      }
    }
    if (this.si_no.length != 0) {
      for (let si of this.si_no) {
        this.AuditoriesService.put(si, 'BM_SiNo/');
      }
    }
    for (let p of this.preguntes) {
      this.AuditoriesService.put(p, 'BM_PreguntesCreades/');
    }
    let auditoria = NuevoAuditoria(
      this.id,
      this.text,
      null,
      formatDate(new Date(), 'yyyy-MM-dd', 'en')
    );
    this.AuditoriesService.put(auditoria, 'BM_Auditories/');
  }
}
