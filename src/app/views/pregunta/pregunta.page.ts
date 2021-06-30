import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { opcio } from 'src/app/models/BM_opcio';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { checkbox } from '../../models/BM_checkbox';
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
  preguntes: preguntaCreacio[] = [];
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
  ArraySINO: opcio[] = [{ BM_checked: false }];

  radioButtonArray: opcio[] = [{ BM_checked: false }];
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
    private AuditoriesService: AuditoriesService,
    private afs: AngularFirestore
  ) {}

  async ngOnInit() {
    await (
      await this.AuditoriesService.getAllPreguntes()
    ).docs.forEach((res) => {
      this.preguntes.push(res.data());
    });
  }
  AddRadio() {
    this.radioButtonArray.push({ BM_checked: false });
  }
  AddCheck() {
    this.checkboxArray.push({ value: '', isItemChecked: false });
  }
  async guardar() {
    let p = new preguntaCreacio(
      this.afs.createId(),
      this.text,
      this.Checkboxes[1].isItemChecked,
      this.Checkboxes[0].isItemChecked,
      this.puntuacio,
      this.Checkboxes[2].isItemChecked,
      this.auditoriaID,
      this.tipo
    );
    if (this.tipo == 'radiobutton') {
      let r = new radio(null, p.BM_id, this.radioButtonArray);
      this.modalController.dismiss({ p, r });
      console.log('radio guardar');
    } else if (this.tipo == 'checkbox') {
      let r = new checkbox(null, p.BM_id, this.checkboxArray);
      this.modalController.dismiss({ p, r });
    } else if (this.tipo == 'text') {
      let r = new text(null, p.BM_id);
      this.modalController.dismiss({ p, r });
    } else if (this.tipo == 'SliderNumero') {
      let r = new slider(null, p.BM_id);
      this.modalController.dismiss({ p, r });
    } else if (this.tipo == 'sliderIcono') {
      let r = new smile(null, p.BM_id);
      this.modalController.dismiss({ p, r });
    } else if (this.tipo == 'si/no') {
      let r = new si_no(null, p.BM_id, this.text1, this.text2, this.textTrue);
      this.modalController.dismiss({ p, r });
    } else if (this.tipo == 'numero') {
      let r = new numero(null, p.BM_id);
      this.modalController.dismiss({ p, r });
    }
  }

  radioGroupChange(event) {
    if (event.detail.value == 'BM_text1') this.textTrue = this.text1;
    else this.textTrue = this.text2;
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

  private back() {
    this.modalController.dismiss();
  }
}
