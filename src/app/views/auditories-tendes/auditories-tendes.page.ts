import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
import {
  LoadingController,
  MenuController,
  ModalController,
  Platform,
  PopoverController,
} from '@ionic/angular';
import {
  CalendarModal,
  CalendarModalOptions,
  CalendarResult,
} from 'ion2-calendar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { auditories } from 'src/app/models/BM_Auditories';
import { localitat } from 'src/app/models/BM_Localitat';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { LocalitatService } from 'src/app/services/BM_Localitat.service';
import { StoragesessionService } from 'src/app/services/storagesession.service';
import { HttpClient } from '@angular/common/http';
import { pregunta } from 'src/app/models/BM_Pregunta';
import { checkbox } from 'src/app/models/BM_checkbox';
import { radio } from 'src/app/models/BM_Radio';
import { text } from 'src/app/models/BM_text';
import { numero } from 'src/app/models/BM_numero';
import { smile } from 'src/app/models/BM_smile';
import { slider } from 'src/app/models/BM_slider';
import { si_no } from 'src/app/models/BM_si_no';

@Component({
  selector: 'app-auditories-tendes',
  templateUrl: './auditories-tendes.page.html',
  styleUrls: ['./auditories-tendes.page.scss'],
})
export class AuditoriesTendesPage implements OnInit {
  logoData = null;
  danger_icon = null;
  admin;
  localitats$: Observable<localitat[]>;
  auditories$ = this.auditoriaService.auditories_tendes;
  loading;
  auditories: auditories[];
  pdfObj = null;
  check = true;
  preguntes: pregunta[] = [];
  private row: String[] = [];
  Arraycheckbox: checkbox[] = [];
  Arrayradio: radio[] = [];
  Arraytext: text[] = [];
  Arraynumeros: numero[] = [];
  Arraysmile: smile[] = [];
  Arrayslider: slider[] = [];
  Arraysi_no: si_no[] = [];
  respostes: string[] = [];
  danger;
  logo;
  constructor(
    private menu: MenuController,
    private http: HttpClient,
    private auditoriaService: AuditoriesService,
    private stgService: StoragesessionService,
    private menuView: AppComponent,
    private route: Router,
    private localitatService: LocalitatService,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
    private fileOpener: FileOpener,
    private plt: Platform,
    private AuditoriesService: AuditoriesService
  ) {}

  async ngOnInit() {
    this.loadLocalAssetToBase64('./assets/icon/blat-market.png');
    this.loadLocalAssetToBase64_2('./assets/icon/warning_icon.PNG');
    this.menu.close();
    if (this.stgService.isAdmin() || this.stgService.isAuditor()) {
      this.menuView.admin = true;
      this.admin = true;
    } else {
      this.menuView.admin = false;
      this.admin = false;
    }

    this.menu.enable(true);
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Espere',
    });
    this.loading.present();
    this.loadData();
  }
  async loadData() {
    this.localitats$ = this.localitatService
      .getAll()
      .pipe(
        map((action) => action.map((a) => a.payload.doc.data() as localitat))
      );

    this.localitats$ = this.localitats$.pipe(
      map((res) => {
        res.sort((t1, t2) => {
          const name1 = t1.BM_ID;
          const name2 = t2.BM_ID;
          if (name1 > name2) {
            return 1;
          }
          if (name1 < name2) {
            return -1;
          }
          return 0;
        });
        return res;
      })
    );
    this.auditories$ = this.auditories$.pipe(
      map((res) => {
        res.sort((t1, t2) => {
          const name1 = t1.BM_data;
          const name2 = t2.BM_data;
          if (name1 > name2) {
            return 1;
          }
          if (name1 < name2) {
            return -1;
          }
          return 0;
        });
        return res;
      })
    );

    this.auditories$.subscribe((res) => (this.auditories = res));
    this.loading.dismiss();
  }
  loadLocalAssetToBase64(imatge) {
    this.http.get(imatge, { responseType: 'blob' }).subscribe((res) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.logoData = reader.result;
      };
      reader.readAsDataURL(res);
    });
  }
  loadLocalAssetToBase64_2(imatge) {
    this.http.get(imatge, { responseType: 'blob' }).subscribe((res) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.danger_icon = reader.result;
      };
      reader.readAsDataURL(res);
    });
  }
  async generatePDF(localitat: localitat, auditoria: auditories) {
    this.danger = { image: this.danger_icon, width: 20 };
    this.logo = { image: this.logoData, width: 50 };
    this.preguntes.length = 0;
    const preguntesTenda =
      await this.AuditoriesService.getAllPreguntesAuditoria(auditoria);
    preguntesTenda.docs.forEach((doc) => {
      if (doc.data().BM_auditoriaId === auditoria.BM_id) {
        this.preguntes.push(doc.data());
      }
    });
    this.loading.dismiss();
    await this.getAllPreguntes();
    this.generearaPreguntaPDF();
    this.auditories.forEach((aud) => this.row.push(aud.BM_nom));
    const docDefinition = {
      content: [
        this.logo,
        {
          text: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          aligment: 'right',
        },
        {
          text: localitat.BM_Poblacio,
          style: 'header',
        },
        {
          text: localitat.BM_direccio + ', ' + localitat.BM_cp,
          style: 'header',
        },
        {
          text: auditoria.BM_nom + ': ' + auditoria.BM_Resultat + '%',
          style: 'header',
        },
        { text: 'Lista de preguntas', style: 'header' },
        {
          ol: [...this.respostes],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'left',
        },
      },
    };

    this.pdfObj = pdfMake.createPdf(docDefinition);
    const { Filesystem } = Plugins;
    if (this.plt.is('cordova')) {
      this.pdfObj.getBase64(async (data) => {
        try {
          let path = `pdf/auditoria_${Date.now()}.pdf`;
          const result = await Filesystem.writeFile({
            path,
            data,
            directory: FilesystemDirectory.Documents,
            recursive: true,
          });
          this.fileOpener.open(`${result.uri}`, 'application/pdf');
        } catch (e) {
          console.error(e);
        }
      });
    } else {
      // On a browser simply use download
      this.pdfObj.download();
    }
    console.log(this.respostes);
    this.respostes.length = 0;
    console.log(this.respostes);
    this.check = true;
  }
  async getAllPreguntes() {
    this.Arraycheckbox = [];
    this.Arraynumeros = [];
    this.Arrayradio = [];
    this.Arraysi_no = [];
    this.Arrayslider = [];
    this.Arraysmile = [];
    this.Arraytext = [];
    const checkboxDB = await this.AuditoriesService.getAllCheckbox();
    if (checkboxDB.size != 0)
      checkboxDB.forEach((doc) => {
        this.Arraycheckbox.push(doc.data());
      });

    const radioDB = await this.AuditoriesService.getAllRadio();
    if (radioDB.size != 0)
      radioDB.forEach((doc) => {
        this.Arrayradio.push(doc.data());
      });

    const sliderDB = await this.AuditoriesService.getAllSlider();
    if (sliderDB.size != 0)
      sliderDB.forEach((doc) => {
        this.Arrayslider.push(doc.data());
      });

    const smileDB = await this.AuditoriesService.getAllSmile();
    if (smileDB.size != 0)
      smileDB.forEach((doc) => {
        this.Arraysmile.push(doc.data());
      });

    const SiNoDB = await this.AuditoriesService.getAllSiNo();
    if (SiNoDB.size != 0)
      SiNoDB.forEach((doc) => {
        this.Arraysi_no.push(doc.data());
      });

    const textDB = await this.AuditoriesService.getAllText();
    if (textDB.size != 0)
      textDB.forEach((doc) => {
        this.Arraytext.push(doc.data());
      });

    //Accedit a totes les preguntes tipus numero de la base de dades
    const numeroDB = await this.AuditoriesService.getAllNumero();
    if (numeroDB.size != 0)
      numeroDB.forEach((doc) => {
        this.Arraynumeros.push(doc.data());
      });
  }
  generearaPreguntaPDF() {
    console.log(this.respostes);
    this.respostes.length = 0;
    console.log(this.respostes);
    let s = '';
    console.log(this.preguntes);
    this.preguntes.forEach((res) => {
      console.log(res.BM_tipo);
      if (res.BM_tipo == 'numero') {
        console.log('array ple');
        this.Arraynumeros.forEach((num) => {
          if (res.BM_id == num.BM_id) {
            console.log('array ple');
            s = res.BM_nom + '          ' + num.BM_resultat;
            this.respostes.push(s);
            console.log(s);
          }
        });
      }
      if (res.BM_tipo == 'checkbox') {
        this.Arraycheckbox.forEach((check) => {
          if (res.BM_id == check.BM_id) {
            s = res.BM_nom + '          ' + check.BM_resultat;
            this.respostes.push(s);
            console.log(s);
          }
        });
      }
      if (res.BM_tipo == 'radiobutton') {
        this.Arrayradio.forEach((radio) => {
          if (res.BM_id == radio.BM_id) {
            s = res.BM_nom + '          ' + radio.BM_resultat;
            this.respostes.push(s);
            console.log(s);
          }
        });
      }
      if (res.BM_tipo == 'si/no') {
        this.Arraysi_no.forEach((sino) => {
          console.log(res.BM_id);
          console.log(sino.BM_id);
          if (res.BM_id == sino.BM_id) {
            if (sino.BM_resultat != sino.BM_correcta) {
              s = res.BM_nom + '          NO';
              this.respostes.push(s);
              console.log(s);
            }
            if (sino.BM_resultat == sino.BM_correcta) {
              s =
                res.BM_nom +
                '          SI' +
                '        (Puntuación ' +
                res.BM_puntuacio +
                ')';
              this.respostes.push(s);
              console.log(s);
            }
          }
        });
      }
      if (res.BM_tipo == 'SliderNumero') {
        this.Arrayslider.forEach((slider) => {
          if (res.BM_id == slider.BM_id) {
            s = res.BM_nom + '          ' + slider.BM_resultat;
            this.respostes.push(s);
            console.log(s);
          }
        });
      }
      if (res.BM_tipo == 'sliderIcono') {
        this.Arraysmile.forEach((smile) => {
          if (res.BM_id == smile.BM_id) {
            s = res.BM_nom + '          ' + smile.BM_resultat;
            this.respostes.push(s);
            console.log(s);
          }
        });
      }
      if (res.BM_tipo == 'text') {
        this.Arraytext.forEach((text) => {
          if (res.BM_id == text.BM_id) {
            s = res.BM_nom + '          ' + text.BM_resultat;
            this.respostes.push(s);
            console.log(s);
          }
        });
      }
    });
  }

  doubleClick(event, auditoria) {
    if (event.tapCount == 2) {
      this.auditoriaService.setEsView(true);

      this.auditoriaService.setAuditoria(auditoria);

      this.route.navigateByUrl('/auditories-test');
    }
  }
  async openCalendar() {
    this.auditories$.subscribe((res) => (this.auditories = res));

    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'Calendario',
      canBackwardsSelected: true,
      weekdays: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'],
      monthFormat: 'YYYY MM ',
      closeLabel: 'Cancelar',
      doneLabel: 'Finalizar',
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options },
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date = event.data;
    const from: CalendarResult = date.from;
    const to: CalendarResult = date.to;

    const fromFormated = formatDate(new Date(from.string), 'yyyy-MM-dd', 'en');
    const toFormated = formatDate(new Date(to.string), 'yyyy-MM-dd', 'en');

    let aux: auditories[] = [];
    for (let aud of this.auditories) {
      if (aud.BM_data >= fromFormated && aud.BM_data <= toFormated) {
        aux.push(aud);
      }
    }
    this.auditories = aux;
    console.log(this.auditories);
  }
  filterAuditoria(event) {
    if (event.detail.value != 0) {
      console.log(event.detail.value);
      let aux: auditories[] = [];
      for (let aud of this.auditories) {
        if (aud.BM_tendaId == event.detail.value) {
          aux.push(aud);
        }
      }
      this.auditories = aux;
      event.detail.value == 0;
    }
  }
  resetAuditories() {
    this.auditories$.subscribe((res) => (this.auditories = res));
  }
}
