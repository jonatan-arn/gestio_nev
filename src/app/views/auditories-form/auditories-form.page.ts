import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  MenuController,
  ModalController,
  NavController,
  NavParams,
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
  @Input() aud: auditories;
  auditories$;
  @Input() edit: boolean;
  auditoriesAux = [];
  id: string;
  isSubscribe: boolean = false;
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
    private modalController: ModalController,
    private alertController: AlertController,
    private AuditoriesService: AuditoriesService
  ) {}

  ngOnInit() {
    if (this.aud != undefined) {
      this.id = this.aud.BM_id;
      this.nom = this.aud.BM_nom;
      this.AuditoriesService.getPreguntes(this.aud.BM_id).subscribe((res) => {
        this.preguntes = res;
      });
    }
  }
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
    if (modal.onDidDismiss()) {
      let preg: preguntaCreacio = data.p;
      let b: boolean = false;
      if (this.preguntes.length != 0)
        for (let p of this.preguntes) {
          if (p.BM_id == preg.BM_id) {
            b = true;
            this.alerta('Esa pregunta con ese id ya existe en esta auditoria');
            break;
          } else b = false;
        }
      if (!b) {
        this.preguntes.push(preg);
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
  back() {
    this.modalController.dismiss();
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
          if (this.edit) {
            const dataPreg = this.AuditoriesService.get(
              'BM_PreguntesCreades/',
              'BM_auditoriaId',
              p.BM_auditoriaId
            );

            this.AuditoriesService.delete(dataPreg, 'BM_PreguntesCreades');
          }
          p.BM_auditoriaId = this.id;
          this.AuditoriesService.put(p, 'BM_PreguntesCreades/');
        }
        let auditoria = new auditories(
          this.id,
          this.nom,
          null,
          formatDate(new Date(), 'yyyy-MM-dd', 'en')
        );
        if (this.edit) {
          const dataCollection = this.AuditoriesService.get(
            'BM_Auditories/',
            'BM_id',
            auditoria.BM_id
          );
          this.AuditoriesService.delete(dataCollection, 'BM_Auditories');
        }
        console.log(auditoria);
        this.AuditoriesService.onSaveAuditoria(auditoria);
        //this.AuditoriesService.put(auditoria, 'BM_Auditories/');
        if (this.isSubscribe) this.auditories$.unsubscribe();
        this.modalController.dismiss();
      }
    }
  }
  private borrarPregunta(id) {
    for (var i = 0; i < this.preguntes.length; i++) {
      if (this.preguntes[i].BM_tipo == 'checkbox') {
        if (this.edit) {
          const checkbox = this.AuditoriesService.get(
            'BM_Checkbox/',
            'BM_preguntaId',
            id
          );
          this.AuditoriesService.delete(checkbox, 'BM_Checkbox');
        }
        for (var j = 0; j < this.checkbox.length; j++) {
          if (this.checkbox[j].BM_preguntaId == id) {
            this.checkbox.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'radiobutton') {
        if (this.edit) {
          const radio = this.AuditoriesService.get(
            'BM_Radio/',
            'BM_preguntaId',
            id
          );
          this.AuditoriesService.delete(radio, 'BM_Radio');
        }
        for (var j = 0; j < this.radiobutton.length; j++) {
          if (this.radiobutton[j].BM_preguntaId == id) {
            this.radiobutton.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'text') {
        if (this.edit) {
          const text = this.AuditoriesService.get(
            'BM_Text/',
            'BM_preguntaId',
            id
          );
          this.AuditoriesService.delete(text, 'BM_Text');
        }
        for (var j = 0; j < this.text.length; j++) {
          if (this.text[j].BM_preguntaId == id) {
            this.text.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'SliderNumero') {
        if (this.edit) {
          const slider = this.AuditoriesService.get(
            'BM_Slider/',
            'BM_preguntaId',
            id
          );
          this.AuditoriesService.delete(slider, 'BM_Slider');
        }
        for (var j = 0; j < this.slider.length; j++) {
          if (this.slider[j].BM_preguntaId == id) {
            this.slider.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'sliderIcono') {
        if (this.edit) {
          const smile = this.AuditoriesService.get(
            'BM_Smile/',
            'BM_preguntaId',
            id
          );
          this.AuditoriesService.delete(smile, 'BM_Smile');
        }
        for (var j = 0; j < this.smile.length; j++) {
          if (this.smile[j].BM_preguntaId == id) {
            this.smile.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'si/no') {
        if (this.edit) {
          const si_no = this.AuditoriesService.get(
            'BM_SiNo/',
            'BM_preguntaId',
            id
          );
          this.AuditoriesService.delete(si_no, 'BM_SiNo');
        }
        for (var j = 0; j < this.si_no.length; j++) {
          if (this.si_no[j].BM_preguntaId == id) {
            this.si_no.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'numero') {
        console.log('numero');
        if (this.edit) {
          console.log('numero borrat');
          const numero = this.AuditoriesService.get(
            'BM_Numero/',
            'BM_preguntaId',
            id
          );
          this.AuditoriesService.delete(numero, 'BM_Numero');
        }
        for (var j = 0; j < this.numeros.length; j++) {
          if (this.numeros[j].BM_preguntaId == id) {
            this.numeros.splice(j, 1);
          }
        }
      }
      if (this.preguntes[i].BM_id == id) {
        if (this.edit) {
          console.log('pregunta borrada');
          const dataPreg = this.AuditoriesService.get(
            'BM_PreguntesCreades/',
            'BM_auditoriaId',
            this.preguntes[i].BM_auditoriaId
          );
          this.AuditoriesService.delete(dataPreg, 'BM_PreguntesCreades');
        }
        this.preguntes.splice(i, 1);
      }
    }
  }
  private async checkId() {
    this.isSubscribe = true;
    this.auditories$ = this.AuditoriesService.checkIdAuditoria(
      this.id
    ).subscribe((res) => {
      if (res.length != 0)
        if (this.b) {
          this.alerta('Ya existe una auditoria con ese id');
          this.b = false;
        } else {
          this.b = true;
        }
    });
  }
}
