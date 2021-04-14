import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, Platform } from '@ionic/angular';
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
import { CalendarComponentOptions } from 'ion2-calendar';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
import { FileOpenerOriginal } from '@ionic-native/file-opener';
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
  private dic = null;
  private array = [];
  dateRange: { from: string; to: string };
  type: 'string';

  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
  };

  constructor(
    private plt: Platform,
    private http: HttpClient,
    private DiesService: DiesService,
    private NeveraService: NeveraService,
    private UsuariService: UsuarisService,
    private StgSesion: StoragesessionService,
    private LocalitatService: LocalitatService,
    private menu: MenuController,
    private fileOpener: FileOpenerOriginal,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadLocalAssetToBase64();
    this.getPdfData();
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

  getPdfData() {
    let s = this.StgSesion.getSessionLoggedIn();
    this.UsuariService.getUsuari(s['username']).subscribe((res) => {
      this.LocalitatService.getLocalitat(res[0].BM_idLocalitat).subscribe(
        (loc) => {
          this.localitat = loc;
        }
      );
      this.NeveraService.getNeveresbyLocalitat(res[0].BM_idLocalitat).subscribe(
        (nev) => {
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
          this.getDies(
            this.neveres,
            formatDate(new Date(), 'yyyy-MM-dd', 'en')
          );
          this.getDies(this.neveres, '2021-04-11');
        }
      );
    });
  }
  getDies(nev, fecha) {
    for (let n of nev) {
      this.DiesService.getDiesByNevera_Fecha(n.BM_id, fecha)
        .get()
        .subscribe((res) => {
          if (!res.empty) {
            res.docs.forEach((doc) => {
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
        });
    }

    this.dic = dicc(fecha, this.diesVista);
    this.array.push(this.dic);
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
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }
  dowloadPDF(data: any, savefile: any) {
    const { Filesystem } = Plugins;

    if (this.plt.is('cordova')) {
      // Save the PDF to the device
      const fileName = 'timesheet.pdf';
      try {
        Filesystem.writeFile({
          path: fileName,
          data: this.pdfObj,
          directory: FilesystemDirectory.Documents,
          // encoding: FilesystemEncoding.UTF8
        }).then((writeFileResult) => {
          Filesystem.getUri({
            directory: FilesystemDirectory.Documents,
            path: fileName,
          }).then(
            (getUriResult) => {
              this.loginAlert();
              const path = getUriResult.uri;
              this.fileOpener
                .open(path, 'application/pdf')
                .then(() => console.log('File is opened'))
                .catch((error) => console.log('Error openening file', error));
            },
            (error) => {
              console.log(error);
            }
          );
        });
      } catch (error) {
        console.error('Unable to write file', error);
      }
    } else {
      // On a browser simply use download
      this.pdfObj.download();
    }

    /* if (this.plt.is('cordova')) {
      this.pdfObj.getBase64((data) => {
        try {
          let path = `pdf/myletter.pdf`;
          const result = Filesystem.writeFile({
            path,
            data,
            directory: FilesystemDirectory.Documents,
            recursive: true,
          });
        } catch (e) {
          console.error('Unable to write file', e);
        }
      });
    } else {
      this.pdfObj.download();
    }*/
  }
  changeName() {
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
  async loginAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error login',
      message: 'Usuario o contraseña incorrectos.',
      buttons: ['OK'],
    });
  }
}
function dicc(a: string, b: dies[]) {
  return {
    fecha: a,
    arraydies: b,
  };
}
