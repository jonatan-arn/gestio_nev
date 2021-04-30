import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  MenuController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { auditories } from 'src/app/models/BM_Auditories';
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
  auditoriesAux = [];
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
  b = true;

  constructor(
    public actionSheetController: ActionSheetController,
    private menu: MenuController,
    private modalController: ModalController,
    private alertController: AlertController,
    private AuditoriesService: AuditoriesService,
    private nav: NavController
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
    if (modal.onDidDismiss())
      for (let p of this.preguntes) {
        if (p.BM_id == data.p.BM_id)
          this.alerta('Esa pregunta con ese id ya existe en esta auditoria');
        else {
          let p: preguntaCreacio = data.p;
          this.preguntes.push(p);
          if (data.r instanceof checkbox) this.checkbox.push(data.r);
          else if (data.r instanceof radio) this.radiobutton.push(data.r);
          else if (data.r instanceof slider) this.slider.push(data.r);
          else if (data.r instanceof smile) this.smile.push(data.r);
          else if (data.r instanceof si_no) this.si_no.push(data.r);
          else if (data.r instanceof numero) this.numeros.push(data.r);
          else if (data.r instanceof text) this.text.push(data.r);
        }
      }
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
  async guardar() {
    if (this.preguntes.length == 0) {
      this.alerta('Esta auditoria no tiene creada ninguna pregunta');
    } else {
      if (this.nom == undefined || this.nom == '')
        this.alerta('La auditoria no tiene nombre');
      else {
        if (this.checkbox.length != 0) {
          console.log('check');
          for (let box of this.checkbox) {
            this.AuditoriesService.put(box, 'BM_Checkbox/');
          }
        }
        if (this.radiobutton.length != 0) {
          console.log('radio');
          for (let radio of this.radiobutton) {
            this.AuditoriesService.put(radio, 'BM_Radio/');
          }
        }
        if (this.text.length != 0) {
          console.log('text');
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
          console.log('slider');
          for (let sli of this.slider) {
            this.AuditoriesService.put(sli, 'BM_Slider/');
          }
        }
        if (this.smile.length != 0) {
          console.log('smile');
          for (let sml of this.smile) {
            this.AuditoriesService.put(sml, 'BM_Smile/');
          }
        }
        if (this.si_no.length != 0) {
          console.log('si/no');
          for (let si of this.si_no) {
            this.AuditoriesService.put(si, 'BM_SiNo/');
          }
        }
        for (let p of this.preguntes) {
          this.AuditoriesService.put(p, 'BM_PreguntesCreades/');
        }
        let auditoria = new auditories(
          this.id,
          this.nom,
          null,
          formatDate(new Date(), 'yyyy-MM-dd', 'en')
        );
        this.AuditoriesService.put(auditoria, 'BM_Auditories/');
        this.nav.back();
      }
    }
  }
  private borrarPregunta(id) {
    for (var i = 0; i < this.preguntes.length; i++) {
      if (this.preguntes[i].BM_tipo == 'checkbox') {
        for (var j = 0; j < this.checkbox.length; j++) {
          if (this.checkbox[j].BM_preguntaId == id) {
            this.checkbox.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'radiobutton') {
        for (var j = 0; j < this.radiobutton.length; j++) {
          if (this.radiobutton[j].BM_preguntaId == id) {
            this.radiobutton.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'text') {
        for (var j = 0; j < this.text.length; j++) {
          if (this.text[j].BM_preguntaId == id) {
            this.text.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'SliderNumero') {
        for (var j = 0; j < this.slider.length; j++) {
          if (this.slider[j].BM_preguntaId == id) {
            this.slider.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'sliderIcono') {
        for (var j = 0; j < this.smile.length; j++) {
          if (this.smile[j].BM_preguntaId == id) {
            this.smile.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'si/no') {
        for (var j = 0; j < this.si_no.length; j++) {
          if (this.si_no[j].BM_preguntaId == id) {
            this.si_no.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'numero') {
        for (var j = 0; j < this.numeros.length; j++) {
          if (this.numeros[j].BM_preguntaId == id) {
            this.numeros.splice(j, 1);
          }
        }
      }
      if (this.preguntes[i].BM_id == id) {
        this.preguntes.splice(i, 1);
      }
    }
  }
  private async checkId() {
    this.AuditoriesService.checkIdAuditoria(this.id).subscribe((res) => {
      if (res.length != 0)
        if (this.b) {
          this.alerta('Ya existe una auditoria con ese id');
          this.b = false;
        }
    }).unsubscribe;
  }
}
