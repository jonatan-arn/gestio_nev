import { formatDate } from '@angular/common';
import { templateJitUrl } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';

import { auditories } from 'src/app/models/BM_Auditories';
import { checkbox } from 'src/app/models/BM_checkbox';
import { numero } from 'src/app/models/BM_numero';
import { opcio } from 'src/app/models/BM_opcio';
import { pregunta } from 'src/app/models/BM_Pregunta';
import { preguntaCreacio } from 'src/app/models/BM_PreguntaCreacio';
import { radio } from 'src/app/models/BM_Radio';
import { si_no } from 'src/app/models/BM_si_no';
import { slider } from 'src/app/models/BM_slider';
import { smile } from 'src/app/models/BM_smile';
import { text } from 'src/app/models/BM_text';
import { usuaris } from 'src/app/models/BM_usuaris';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { UsuarisService } from 'src/app/services/BM_usuaris.service';
import { StoragesessionService } from 'src/app/services/storagesession.service';
import { CameraViewPage } from 'src/app/views/camera-view/camera-view.page';
@Component({
  selector: 'app-auditories-test',
  templateUrl: './auditories-test.page.html',
  styleUrls: ['./auditories-test.page.scss'],
})
export class AuditoriesTestPage implements OnInit {
  esView: boolean;

  aud: auditories;
  Arraypreguntes: preguntaCreacio[] = [];
  Arraycheckbox: checkbox[] = [];
  Arrayradio: radio[] = [];
  Arraytext: text[] = [];
  Arraynumeros: numero[] = [];
  Arraysmile: smile[] = [];
  Arrayslider: slider[] = [];
  Arraysi_no: si_no[] = [];
  loading;
  puntuacio: number;
  preguntes: pregunta[] = [];
  preguntesTenda: pregunta[] = [];
  user: usuaris;
  checkbox: string[] = null;
  comentari: string = null;
  CheckC: boolean = false;
  CheckI: boolean = false;
  adminView: boolean = false;
  constructor(
    private AuditoriesService: AuditoriesService,
    private router: NavController,
    private alertController: AlertController,
    private modalController: ModalController,
    private userService: UsuarisService,
    private stgSesion: StoragesessionService,
    private toastController: ToastController,
    private afs: AngularFirestore,
    private stgService: StoragesessionService,
    private loaginController: LoadingController
  ) {}

  async ngOnInit() {
    this.aud = this.AuditoriesService.getAuditoria();
    this.esView = this.AuditoriesService.getEsView();
    if (this.stgService.isAdmin() || this.stgService.isAuditor())
      this.adminView = true;

    this.user = this.stgSesion.userLog;

    console.log(this.aud);
    this.loading = await this.loaginController.create({
      cssClass: 'my-custom-class',
      message: 'Espere',
    });
    this.loading.present();
    if (this.esView) {
      const preguntesTenda =
        await this.AuditoriesService.getAllPreguntesTenda();
      preguntesTenda.docs.forEach((doc) => {
        if (doc.data().BM_auditoriaId === this.aud.BM_id) {
          this.preguntes.push(doc.data());
          this.preguntesTenda.push(doc.data());
        }
      });
      this.loading.dismiss();
      this.getAllPreguntes(this.preguntesTenda);
    } else {
      const preguntes = await this.AuditoriesService.getAllPreguntes();
      preguntes.docs.forEach((doc) => {
        if (this.aud.BM_id === doc.data().BM_auditoriaId) {
          this.preguntes.push(
            new pregunta(
              doc.data().BM_id,
              doc.data().BM_nom,
              null,
              '',
              doc.data().BM_puntuacio,
              doc.data().BM_perill,
              doc.data().BM_auditoriaId,
              doc.data().BM_tipo
            )
          );
          this.Arraypreguntes.push(doc.data());
        }
        this.loading.dismiss();
      });
      this.getAllPreguntes(this.Arraypreguntes);
    }
  }

  async getAllPreguntes(preguntes) {
    const checkboxDB = await this.AuditoriesService.getAllCheckbox();
    if (checkboxDB.size != 0)
      checkboxDB.forEach((doc) => this.Arraycheckbox.push(doc.data()));

    const radioDB = await this.AuditoriesService.getAllRadio();
    if (radioDB.size != 0)
      radioDB.forEach((doc) => this.Arrayradio.push(doc.data()));

    const sliderDB = await this.AuditoriesService.getAllSlider();
    if (sliderDB.size != 0)
      sliderDB.forEach((doc) => this.Arrayslider.push(doc.data()));

    const smileDB = await this.AuditoriesService.getAllSmile();
    if (smileDB.size != 0)
      smileDB.forEach((doc) => this.Arraysmile.push(doc.data()));

    const SiNoDB = await this.AuditoriesService.getAllSiNo();
    if (SiNoDB.size != 0)
      SiNoDB.forEach((doc) => this.Arraysi_no.push(doc.data()));

    const textDB = await this.AuditoriesService.getAllText();
    if (textDB.size != 0)
      textDB.forEach((doc) => this.Arraytext.push(doc.data()));

    //Accedit a totes les preguntes tipus numero de la base de dades
    const numeroDB = await this.AuditoriesService.getAllNumero();
    if (numeroDB.size != 0)
      numeroDB.forEach((doc) => this.Arraynumeros.push(doc.data()));
  }
  back() {
    this.router.back();
  }
  guardar() {
    if (!this.validarForm()) {
      this.aud.BM_data = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.aud.BM_Resultat = 0;
      const id = this.aud.BM_id;
      let puntuacio_total = 0;
      let puntuacio_user = 0;
      this.aud.BM_id = this.afs.createId();
      for (let p of this.preguntes) {
        p.BM_auditoriaId = this.aud.BM_id;
        puntuacio_total = puntuacio_total + p.BM_puntuacio;
        if (this.Arraynumeros != null || this.Arraynumeros.length == 0) {
          for (let s of this.Arraynumeros) {
            if (s.BM_id == p.BM_id) {
              p.BM_id = this.afs.createId();
              s.BM_id = p.BM_id;
              puntuacio_user = puntuacio_user + p.BM_puntuacio;
              this.AuditoriesService.onSaveAudTenda(p, 'BM_Preguntes');
              this.AuditoriesService.onSaveAudTenda(s, 'BM_Numero');
            }
          }
        }
        if (this.Arraytext != null || this.Arraytext.length == 0) {
          for (let s of this.Arraytext) {
            if (s.BM_id == p.BM_id) {
              p.BM_id = this.afs.createId();
              s.BM_id = p.BM_id;
              puntuacio_user = puntuacio_user + p.BM_puntuacio;
              this.AuditoriesService.onSaveAudTenda(p, 'BM_Preguntes');
              this.AuditoriesService.onSaveAudTenda(s, 'BM_Text');
            }
          }
        }
        if (this.Arraysi_no != null || this.Arraysi_no.length == 0) {
          for (let s of this.Arraysi_no) {
            if (s.BM_id == p.BM_id) {
              p.BM_id = this.afs.createId();
              s.BM_id = p.BM_id;
              if (s.BM_correcta == s.BM_resultat)
                puntuacio_user = puntuacio_user + p.BM_puntuacio;
              this.AuditoriesService.onSaveAudTenda(p, 'BM_Preguntes');
              this.AuditoriesService.onSaveAudTenda(s, 'BM_SiNo');
            }
          }
        }
        if (this.Arrayslider != null || this.Arrayslider.length == 0) {
          for (let s of this.Arrayslider) {
            if (s.BM_id == p.BM_id) {
              p.BM_id = this.afs.createId();
              s.BM_id = p.BM_id;
              puntuacio_user =
                puntuacio_user + p.BM_puntuacio * (s.BM_resultat / 10);
              this.AuditoriesService.onSaveAudTenda(p, 'BM_Preguntes');
              this.AuditoriesService.onSaveAudTenda(s, 'BM_Slider');
            }
          }
        }
        if (this.Arraysmile != null || this.Arraysmile.length == 0) {
          for (let s of this.Arraysmile) {
            if (s.BM_id == p.BM_id) {
              p.BM_id = this.afs.createId();
              s.BM_id = p.BM_id;
              puntuacio_user =
                puntuacio_user + p.BM_puntuacio * (s.BM_resultat / 10);
              this.AuditoriesService.onSaveAudTenda(p, 'BM_Preguntes');
              this.AuditoriesService.onSaveAudTenda(s, 'BM_Smile');
            }
          }
        }
        console.log(this.Arraycheckbox);
        if (this.Arraycheckbox != null || this.Arraycheckbox.length == 0) {
          for (let s of this.Arraycheckbox) {
            console.log(p.BM_id);
            console.log(s.BM_id);
            if (s.BM_id == p.BM_id) {
              p.BM_id = this.afs.createId();
              s.BM_id = p.BM_id;
              this.addCheck(s.BM_id);
              puntuacio_user = puntuacio_user + p.BM_puntuacio;

              this.AuditoriesService.onSaveAudTenda(p, 'BM_Preguntes');
              this.AuditoriesService.onSaveAudTenda(s, 'BM_Checkbox');
            }
          }
        }
        if (this.Arrayradio != null || this.Arrayradio.length == 0) {
          for (let s of this.Arrayradio) {
            if (s.BM_id == p.BM_id) {
              p.BM_id = this.afs.createId();
              s.BM_id = p.BM_id;
              puntuacio_user = puntuacio_user + p.BM_puntuacio;
              this.AuditoriesService.onSaveAudTenda(p, 'BM_Preguntes');
              this.AuditoriesService.onSaveAudTenda(s, 'BM_Radio');
            }
          }
        }
      }
      puntuacio_user = 100 * (puntuacio_user / puntuacio_total);

      this.aud.BM_Resultat = puntuacio_user;
      this.AuditoriesService.onSaveAudTenda(this.aud, 'BM_AuditoriesTenda');
      this.aud.BM_id = id;
      this.presentToast();
      this.AuditoriesService.setEsView(false);
    }
  }
  radioSiNo(event, id) {
    this.Arraysi_no.forEach((value, index) => {
      if (value.BM_id == id) {
      }
      this.Arraysi_no[index].BM_resultat = event.detail.value;
    });
  }
  radioE(event, id) {
    this.Arrayradio.forEach((value, index) => {
      if (value.BM_id == id) {
        this.Arrayradio[index].BM_opcions.forEach((value2, index2) => {
          if (value2.value == event.detail.value)
            this.Arrayradio[index].BM_opcions[index2].BM_checked = true;
        });
        this.Arrayradio[index].BM_resultat = event.detail.value;
      }
    });
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
  addCheck(id) {
    this.Arraycheckbox.forEach((element: checkbox) => {
      console.log(element);
      element.BM_resultat = [];
      if (element.BM_id == id)
        for (let r of element.BM_opcions) {
          if (r.isItemChecked == true) {
            element.BM_resultat.push(r.value);
          }
        }
    });
  }
  async openCamera(pregunta: pregunta) {
    const modal = await this.modalController.create({
      component: CameraViewPage,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (modal.onDidDismiss()) {
      if (data != null) pregunta.BM_imatge = data;
    }
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Auditoria realizada correctamente',
      duration: 2000,
    });
    toast.present();
    this.back();
  }
  validarForm() {
    let textAlerta = '';
    for (let p of this.Arraypreguntes) {
      if (p.BM_comentari == true) {
        console.log(p.BM_id);
        for (let pForm of this.preguntes) {
          if (p.BM_id == pForm.BM_id) {
            console.log('ids iguals');
            console.log(pForm.BM_comentari);
            if (pForm.BM_comentari == '' || pForm.BM_comentari == undefined)
              textAlerta =
                textAlerta +
                'La pregunta: ' +
                pForm.BM_nom +
                ' requiere un comentario. \n';
          }
        }
      }
      if (p.BM_imatge == true) {
        for (let pForm of this.preguntes) {
          if (p.BM_id == pForm.BM_id)
            if (pForm.BM_imatge == null || pForm.BM_comentari == undefined)
              textAlerta =
                textAlerta +
                'La pregunta: ' +
                pForm.BM_nom +
                ' requiere una imagen. \n';
        }
      }
    }
    console.log(textAlerta);
    if (textAlerta != '') {
      this.alerta(textAlerta);
      return true;
    } else return false;
  }
  getColorComentari(pregunta: pregunta) {
    for (let p of this.Arraypreguntes) {
      if (p.BM_id == pregunta.BM_id)
        if (p.BM_comentari == true) {
          return 'red';
        }
    }
  }
  getColorImatge(pregunta: pregunta) {
    for (let p of this.Arraypreguntes) {
      if (p.BM_id == pregunta.BM_id)
        if (p.BM_imatge == true) {
          return 'red';
        }
    }
  }
}
