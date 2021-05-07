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
import { Observable } from 'rxjs';
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
  auditoriesAux: auditories[] = [];
  id: string;
  nom: string;
  preguntes: preguntaCreacio[] = [];
  checkbox: checkbox[] = [];
  radio: radio[] = [];
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
    this.AuditoriesService.auditorias.subscribe(
      (res) => (this.auditoriesAux = res)
    );
    if (this.aud != undefined) {
      this.id = this.aud.BM_id;
      this.nom = this.aud.BM_nom;
      this.AuditoriesService.preguntes.subscribe((res) => {
        for (let i = 0; i < res.length; i++)
          if (this.aud.BM_id == res[i].BM_auditoriaId)
            this.preguntes.push(res[i]);
      });

      this.AuditoriesService.checkbox.subscribe((res) => {
        if (res[0] != undefined)
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < this.preguntes.length; j++) {
              if (res[i].BM_id == this.preguntes[j].BM_id)
                this.checkbox.push(res[i]);
            }
          }
      });

      this.AuditoriesService.radio.subscribe((res) => {
        if (res[0] != undefined)
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < this.preguntes.length; j++) {
              if (res[i].BM_id == this.preguntes[j].BM_id)
                this.radio.push(res[i]);
            }
          }
      });

      this.AuditoriesService.slider.subscribe((res) => {
        if (res[0] != undefined)
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < this.preguntes.length; j++) {
              if (res[i].BM_id == this.preguntes[j].BM_id)
                this.slider.push(res[i]);
            }
          }
      });

      this.AuditoriesService.smile.subscribe((res) => {
        if (res[0] != undefined)
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < this.preguntes.length; j++) {
              if (res[i].BM_id == this.preguntes[j].BM_id)
                this.smile.push(res[i]);
            }
          }
      });

      this.AuditoriesService.siNo.subscribe((res) => {
        if (res[0] != undefined)
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < this.preguntes.length; j++) {
              if (res[i].BM_id == this.preguntes[j].BM_id)
                this.si_no.push(res[i]);
            }
          }
      });

      this.AuditoriesService.text.subscribe((res) => {
        if (res[0] != undefined)
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < this.preguntes.length; j++) {
              if (res[i].BM_id == this.preguntes[j].BM_id)
                this.text.push(res[i]);
            }
          }
      });

      this.AuditoriesService.numero.subscribe((res) => {
        if (res[0] != undefined)
          for (var i = 0; i < res.length; i++) {
            for (var j = 0; j < this.preguntes.length; j++) {
              if (res[i].BM_id == this.preguntes[j].BM_id)
                this.numeros.push(res[i]);
            }
          }
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
        else if (data.r instanceof radio) this.radio.push(data.r);
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
            this.AuditoriesService.onSave(box, 'BM_Checkbox');
          }
        }
        if (this.radio.length != 0) {
          console.log('radio');
          for (let radio of this.radio) {
            this.AuditoriesService.onSave(radio, 'BM_Radio');
          }
        }
        if (this.text.length != 0) {
          for (let tex of this.text) {
            this.AuditoriesService.onSave(tex, 'BM_Text');
          }
        }
        if (this.numeros.length != 0) {
          for (let n of this.numeros) {
            this.AuditoriesService.onSave(n, 'BM_Numero');
          }
        }
        if (this.slider.length != 0) {
          console.log('slider');
          for (let sli of this.slider) {
            this.AuditoriesService.onSave(sli, 'BM_Slider');
          }
        }
        if (this.smile.length != 0) {
          console.log('smile');
          for (let sml of this.smile) {
            this.AuditoriesService.onSave(sml, 'BM_Smile');
          }
        }
        if (this.si_no.length != 0) {
          console.log('si/no');
          for (let si of this.si_no) {
            this.AuditoriesService.onSave(si, 'BM_SiNo');
          }
        }
        for (let p of this.preguntes) {
          p.BM_auditoriaId = this.id;
          this.AuditoriesService.onSave(p, 'BM_PreguntesCreades');
        }
        if (this.edit)
          this.AuditoriesService.onDelete(this.aud.BM_id, 'BM_Auditories');
        let auditoria = new auditories(
          this.id,
          this.nom,
          null,
          formatDate(new Date(), 'yyyy-MM-dd', 'en')
        );

        console.log(auditoria);
        this.AuditoriesService.onSave(auditoria, 'BM_Auditories');
        this.modalController.dismiss();
      }
    }
  }
  private borrarPregunta(id) {
    for (var i = 0; i < this.preguntes.length; i++) {
      if (this.preguntes[i].BM_tipo == 'checkbox') {
        for (var j = 0; j < this.checkbox.length; j++) {
          if (this.checkbox[j].BM_id == id) {
            if (this.edit)
              this.AuditoriesService.onDelete(
                this.checkbox[j].BM_id,
                'BM_Checkbox'
              );
            this.checkbox.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'radiobutton') {
        for (var j = 0; j < this.radio.length; j++) {
          if (this.radio[j].BM_id == id) {
            if (this.edit)
              this.AuditoriesService.onDelete(this.radio[j].BM_id, 'BM_Radio');
            this.radio.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'text') {
        for (var j = 0; j < this.text.length; j++) {
          if (this.text[j].BM_id == id) {
            if (this.edit)
              this.AuditoriesService.onDelete(this.text[j].BM_id, 'BM_Text');

            this.text.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'SliderNumero') {
        for (var j = 0; j < this.slider.length; j++) {
          if (this.slider[j].BM_id == id) {
            if (this.edit)
              this.AuditoriesService.onDelete(
                this.slider[j].BM_id,
                'BM_Slider'
              );
            this.slider.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'sliderIcono') {
        for (var j = 0; j < this.smile.length; j++) {
          if (this.smile[j].BM_id == id) {
            if (this.edit)
              this.AuditoriesService.onDelete(this.smile[j].BM_id, 'BM_Smile');
            this.smile.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'si/no') {
        for (var j = 0; j < this.si_no.length; j++) {
          if (this.si_no[j].BM_id == id) {
            if (this.edit)
              this.AuditoriesService.onDelete(this.si_no[j].BM_id, 'BM_SiNo');
            this.si_no.splice(j, 1);
          }
        }
      } else if (this.preguntes[i].BM_tipo == 'numero') {
        console.log('numero');
        for (var j = 0; j < this.numeros.length; j++) {
          if (this.numeros[j].BM_id == id) {
            if (this.edit)
              this.AuditoriesService.onDelete(
                this.numeros[j].BM_id,
                'BM_Numero'
              );
            this.numeros.splice(j, 1);
          }
        }
      }
      if (this.preguntes[i].BM_id == id) {
        if (this.edit) {
          console.log('pregunta borrada');
          this.AuditoriesService.onDelete(
            this.preguntes[i].BM_id,
            'BM_PreguntesCreades'
          );
        }
        this.preguntes.splice(i, 1);
      }
    }
  }
  private checkId() {
    console.log(this.auditoriesAux);
    for (let au of this.auditoriesAux) {
      console.log(au);
      if (au.BM_id == this.id) {
        this.alerta('Ya existe una auditoria con ese id');
        break;
      }
    }
  }
}
