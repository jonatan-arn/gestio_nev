import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, Platform } from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFont from 'pdfmake/build/vfs_fonts';
import { dies, NuevoDia } from '../models/BM_Dies';
import { nevera } from '../models/BM_Nevera';
import { DiesService } from '../services/BM_Dies.service';
import { NeveraService } from '../services/BM_Nevera.service';
import { formatDate } from '@angular/common';
import { UsuarisService } from '../services/BM_usuaris.service';
import { StoragesessionService } from '../services/storagesession.service';
import { LocalitatService } from '../services/BM_Localitat.service';
import { localitat } from '../models/BM_Localitat';
import {
  CalendarModal,
  CalendarModalOptions,
  CalendarResult,
} from 'ion2-calendar';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';

pdfMake.vfs = pdfFont.pdfMake.vfs;
@Component({
  selector: 'app-formulari',
  templateUrl: './formulari.page.html',
  styleUrls: ['./formulari.page.scss'],
})
export class FormulariPage implements OnInit {
  logoData = null;
  private neveres: nevera[];
  pdfObj = null;
  private diesVista: dies[] = [];
  private localitat: localitat[];
  private to: Date;
  private from: Date;
  private check = true;
  private loading;
  private a = true;
  constructor(
    private plt: Platform,
    private http: HttpClient,
    private DiesService: DiesService,
    private NeveraService: NeveraService,
    private UsuariService: UsuarisService,
    private StgSesion: StoragesessionService,
    private LocalitatService: LocalitatService,
    private menu: MenuController,
    private fileOpener: FileOpener,
    public modalCtrl: ModalController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadLocalAssetToBase64();
  }

  async openCalendar() {
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

    this.from = new Date(from.string);
    this.to = new Date(to.string);
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Espere',
    });
    this.loading.present();
    await this.getPdfData();

    console.log(this.a);
  }

  openMenu() {
    this.menu.toggle();
  }

  loadLocalAssetToBase64() {
    this.http
      .get('./assets/icon/blat-market.png', { responseType: 'blob' })
      .subscribe((res) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logoData = reader.result;
        };
        reader.readAsDataURL(res);
      });
  }

  async getPdfData() {
    let s = this.StgSesion.getSessionLoggedIn();
    this.UsuariService.getUsuari(s['username']).subscribe(async (res) => {
      this.a = false;
      this.LocalitatService.getLocalitat(res[0].BM_idLocalitat).subscribe(
        (loc) => {
          this.localitat = loc;
        }
      );
      this.NeveraService.getNeveresbyLocalitat(res[0].BM_idLocalitat).subscribe(
        async (nev) => {
          this.neveres = nev;

          //Ordenar las neveras para la vista
          this.neveres = this.neveres.sort((t1, t2) => {
            const name1 = t1.BM_id;
            const name2 = t2.BM_id;
            if (name1 > name2) {
              return 1;
            }
            if (name1 < name2) {
              return -1;
            }
            return 0;
          });
          await this.getfechadies().then(() => {});
          console.log(this.diesVista);
        }
      );
    });

    console.log(this.a);
  }
  async getfechadies() {
    while (this.from.getDate() <= this.to.getDate()) {
      this.getDies(formatDate(this.from, 'yyyy-MM-dd', 'en'));
      this.from.setDate(this.from.getDate() + 1);
    }
  }

  async getDies(fecha) {
    for (var i = 0; i < this.neveres.length; i++) {
      let s = await this.DiesService.getDiesByNevera_Fecha(
        this.neveres[i].BM_id,
        fecha
      )
        .get()
        .toPromise();
      s.forEach((doc) => {
        this.diesVista.push(
          NuevoDia(
            doc.id,
            doc.data().BM_dia,
            doc.data().BM_temperatura,
            doc.data().BM_idNevera
          )
        );
      });
    }
    console.log(this.diesVista);
    this.loading.dismiss();
    this.check = false;
  }

  generatePDF() {
    this.changeName();
    let logo = { image: this.logoData, width: 50 };

    const docDefinition = {
      content: [
        logo,
        {
          text: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          aligment: 'right',
        },
        {
          text: this.localitat[0].BM_Poblacio,
          style: 'header',
        },
        {
          text: this.localitat[0].BM_direccio + ', ' + this.localitat[0].BM_cp,
          style: 'header',
        },
        { text: 'Lista de temperaturas', style: 'header' },
        this.table(this.diesVista, ['BM_dia', 'BM_temperatura', 'BM_idNevera']),
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'left',
        },
      },
    };
    this.diesVista = [];
    this.pdfObj = pdfMake.createPdf(docDefinition);
    const { Filesystem } = Plugins;
    if (this.plt.is('cordova')) {
      this.pdfObj.getBase64(async (data) => {
        try {
          let path = `pdf/tablaTemeperaturas_${Date.now()}.pdf`;
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
    this.diesVista = [];
    this.check = true;
  }

  changeName() {
    this.diesVista = this.diesVista.sort((t1, t2) => {
      const name1 = t1.BM_dia;
      const name2 = t2.BM_dia;
      if (name1 > name2) {
        return 1;
      }
      if (name1 < name2) {
        return -1;
      }
      return 0;
    });
    this.diesVista.forEach((valor, posicion, array) => {
      this.neveres.forEach((nev) => {
        if (valor.BM_idNevera == nev.BM_id) {
          this.diesVista[posicion].BM_idNevera = nev.BM_nomNevera;
        }
      });
    });
  }
  buildTableBody(data, columns) {
    var body = [];
    var c = ['Dia', 'Temepatura', 'Nevera'];
    body.push(c);

    data.forEach(function (row) {
      var dataRow = [];

      columns.forEach(function (column) {
        dataRow.push(row[column].toString());
      });

      body.push(dataRow);
    });

    return body;
  }

  table(data, columns) {
    return {
      table: {
        headerRows: 1,
        body: this.buildTableBody(data, columns),
      },
    };
  }
}
