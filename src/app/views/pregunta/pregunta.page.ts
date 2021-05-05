import { Component, Input, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { checkbox, NuevoCheckbox } from '../../models/BM_checkbox';
import { numero } from '../../models/BM_numero';
import { preguntaCreacio } from '../../models/BM_PreguntaCreacio';
import { radio } from '../../models/BM_Radio';
import { si_no } from '../../models/BM_si_no';
import { slider } from '../../models/BM_slider';
import { smile } from '../../models/BM_smile';
import { text } from '../../models/BM_text';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage implements OnInit {
  @Input() tipo: string;
  @Input() auditoriaID: string;
  preguntes$;
  b = true;
  preguntesAux = [];
  puntuacio: number = 1;
  text: string;
  textTrue: string;
  imatge: boolean;
  comentari: boolean;
  perill: boolean;
  id: string;
  text1: string;
  text2: string;
  n1: number;
  n2: number;
  radioButtonArray: any = [
    {
      value: '',
    },
  ];
  checkboxArray: any = [
    {
      value: '',
    },
  ];
  Checkboxes = [
    {
      value: 'Comentario',
      isItemChecked: false,
    },
    {
      value: 'Imagen',
      isItemChecked: false,
    },
    {
      value: 'Peligro',
      isItemChecked: false,
    },
  ];
  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private AuditoriesService: AuditoriesService
  ) {}

  ngOnInit() {}
  AddRadio() {
    this.radioButtonArray.push({ value: '' });
  }
  AddCheck() {
    this.checkboxArray.push({ value: '' });
  }
  async guardar() {
    if (this.id == undefined)
      this.alerta('No has introducido el id de la pregunta');
    else {
      let p = new preguntaCreacio(
        this.id,
        this.text,
        this.Checkboxes[1].isItemChecked,
        this.Checkboxes[0].isItemChecked,
        this.puntuacio,
        this.Checkboxes[2].isItemChecked,
        this.auditoriaID,
        this.tipo
      );

      if (this.tipo == 'radiobutton') {
        let r = new radio(null, this.id, this.radioButtonArray);
        this.modalController.dismiss({ p, r });
      } else if (this.tipo == 'checkbox') {
        let r = new checkbox(null, this.id, this.checkboxArray);
        this.modalController.dismiss({ p, r });
      } else if (this.tipo == 'text') {
        let r = new text(null, this.id);
        this.modalController.dismiss({ p, r });
      } else if (this.tipo == 'SliderNumero') {
        let r = new slider(null, this.id, this.n1, this.n2);
        this.modalController.dismiss({ p, r });
      } else if (this.tipo == 'sliderIcono') {
        let r = new smile(null, this.id);
        this.modalController.dismiss({ p, r });
      } else if (this.tipo == 'si/no') {
        let r = new si_no(null, this.id, this.text1, this.text2, this.textTrue);
        this.modalController.dismiss({ p, r });
      } else if (this.tipo == 'numero') {
        let r = new numero(null, this.id);
        this.modalController.dismiss({ p, r });
      }
    }
    this.preguntes$.unsubscribe();
  }

  radioGroupChange(event) {
    this.textTrue = event.detail.value;
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
  private checkId() {
    this.preguntes$ = this.AuditoriesService.checkIdPregunta(this.id).subscribe(
      (res) => {
        if (res.length != 0)
          if (this.b) {
            this.alerta('Ya existe una pregunta con ese id');
            this.b = false;
          } else {
            this.b = true;
          }
      }
    );
  }
  private back() {
    this.modalController.dismiss();
  }
}
