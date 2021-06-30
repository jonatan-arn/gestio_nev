import { Component, OnInit } from '@angular/core';
import { dies } from '../../models/BM_Dies';
import { nevera } from '../../models/BM_Nevera';
import { DiesService } from '../../services/BM_Dies.service';
import { NeveraService } from '../../services/BM_Nevera.service';
import { StoragesessionService } from '../../services/storagesession.service';
import { UsuarisService } from '../../services/BM_usuaris.service';
import { formatDate } from '@angular/common';
import {
  LoadingController,
  MenuController,
  ToastController,
} from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { localitat } from '../../models/BM_Localitat';
import { LocalitatService } from '../../services/BM_Localitat.service';
import { AppComponent } from 'src/app/app.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { usuaris } from 'src/app/models/BM_usuaris';

@Component({
  selector: 'app-gestio-nev',
  templateUrl: './gestio-nev.component.html',
  styleUrls: ['./gestio-nev.component.scss'],
})
export class GestioNevComponent implements OnInit {
  private todayDate;
  private yesterdayDate;
  errorMessage = '';
  private neveres: nevera[] = [];
  private diesVista: dies[] = [];
  private diesVistaAux: dies[] = [];
  private localitat: localitat;
  private usuari: usuaris;
  private dia: dies;
  private check: boolean;
  private alertS: boolean = false;
  private date;
  private loading;

  constructor(
    private DiesService: DiesService,
    private NeveraService: NeveraService,
    private UsuariService: UsuarisService,
    private StgSesion: StoragesessionService,
    private toastController: ToastController,
    private alertController: AlertController,
    private menu: MenuController,
    private emailComposer: EmailComposer,
    private LocalitatService: LocalitatService,
    private menuView: AppComponent,
    private afs: AngularFirestore,
    private loadingController: LoadingController
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Espere',
    });
    this.loading.present();
    if (this.StgSesion.isAdmin() || this.StgSesion.isAuditor()) {
      this.menuView.admin = true;
    } else {
      this.menuView.admin = false;
    }
    this.menu.enable(true);
    this.yesterdayDate = new Date();
    this.yesterdayDate = new Date(
      this.yesterdayDate.setDate(this.yesterdayDate.getDate() - 1)
    );
    this.yesterdayDate = formatDate(this.yesterdayDate, 'yyyy-MM-dd', 'en');
    this.todayDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let s = this.StgSesion.getSessionLoggedIn();
    this.getNeveres(s);
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Temperatura guardada correctamente',
      duration: 2000,
    });
    toast.present();
  }

  async getNeveres(user) {
    console.log('hola');

    this.usuari = this.StgSesion.userLog;

    const neveres = await this.NeveraService.getNeveresbyLocalitat(
      this.usuari.BM_idLocalitat
    )
      .get()
      .toPromise();
    neveres.docs.forEach((res) => this.neveres.push(res.data()));
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
    const localitat = await this.LocalitatService.getLocalitat2(
      this.usuari.BM_idLocalitat
    );
    this.localitat = localitat.docs[0].data();

    this.getDies(this.neveres, this.todayDate);
    this.getYesterdayDies(this.neveres, this.yesterdayDate);
  }

  async getYesterdayDies(nev, fecha) {
    for (let n of nev) {
      const diesDB = await this.DiesService.getDiesByNevera_Fecha(
        n.BM_id,
        fecha
      )
        .get()
        .toPromise();
      if (diesDB.size === 0) {
        this.check = true;
        if (this.alertS == false) {
          this.alertTemp(
            'Las temperaturas de ayer no estan introducidas, introducelas.'
          );
          this.alertS = true;
        }
      } else {
        this.check = false;
      }
    }
  }
  async alertTemp(missatge) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: missatge,
      buttons: ['OK'],
    });

    await alert.present();
  }
  //Metode que rep una nevera i un dia
  async getDies(nev, fecha) {
    for (let n of nev) {
      const diesDB = await this.DiesService.getDiesByNevera_Fecha(
        n.BM_id,
        fecha
      )
        .get()
        .toPromise();

      if (diesDB.size == 0) {
        this.dia = new dies(this.afs.createId(), fecha, 0, n.BM_id);
        this.diesVista.push(this.dia);
      } else {
        diesDB.docs.forEach((doc) => {
          this.diesVista.push(
            new dies(
              doc.id,
              doc.data().BM_dia,
              doc.data().BM_temperatura,
              doc.data().BM_idNevera
            )
          );
        });
      }
    }
    this.loading.dismiss();
  }

  //Metode que se ejectua quan es canvia de dia amb el datePicker
  updateDay($event) {
    const date: String = $event.detail.value.slice(0, 10);
    this.diesVista = [];
    this.check = false;
    this.date = date;
    //Recorre totes les neveres i executa el metode getDies amb la data del datePicker
    this.getDies(this.neveres, date);
  }

  //Metode per actualitza la temperatura introduida per el usuari a la BD
  updateTemp() {
    //Recorrec els dies de la vista
    let c = true;
    this.diesVista.forEach((valor, posicion, array) => {
      if (valor.BM_temperatura == null) {
        c = false;
      } else {
        this.date = valor.BM_dia;
        this.DiesService.addDia(valor);
      }
    });

    if (c) {
      this.presentToast();
      this.changeName();
      this.checkTemp();
    } else {
      this.alertTemp('Alguna temperatura no ha sido introducida');
    }
  }
  openMenu() {
    this.menu.toggle();
  }
  changeName() {
    this.diesVistaAux = [];
    this.diesVista.forEach((val) =>
      this.diesVistaAux.push(Object.assign({}, val))
    );
    this.diesVistaAux.forEach((valor, posicion, array) => {
      this.neveres.forEach((nev) => {
        if (valor.BM_idNevera == nev.BM_id) {
          this.diesVistaAux[posicion].BM_idNevera = nev.BM_nomNevera;
        }
      });
    });
  }
  checkTemp() {
    let send = false;
    let s = '';
    for (let valor of this.diesVistaAux) {
      console.log(valor.BM_idNevera);
      console.log(valor.BM_temperatura);
      if (
        valor.BM_idNevera.includes('Nevera Abierta') ||
        valor.BM_idNevera.includes('Nevera Cerrada') ||
        valor.BM_idNevera.includes('Danone') ||
        valor.BM_idNevera.includes('Nevera Extra+')
      ) {
        if (valor.BM_temperatura > 5 || valor.BM_temperatura < 0) {
          send = true;
          (s =
            s +
            'Temperatura anomala de ' +
            valor.BM_temperatura +
            ' de ' +
            valor.BM_idNevera +
            '.'),
            ' \n';
          //Si es nevera envia correo
        }
      } else if (
        valor.BM_idNevera.includes('Isla') ||
        valor.BM_idNevera.includes('Arcón') ||
        valor.BM_idNevera.includes('Nestlé') ||
        valor.BM_idNevera.includes('Dulcesol') ||
        valor.BM_idNevera.includes('Hielo') ||
        valor.BM_idNevera.includes('Nevera Extra-')
      ) {
        if (valor.BM_temperatura > -12 || valor.BM_temperatura < -25) {
          send = true;

          (s =
            s +
            'Temperatura anomala de ' +
            valor.BM_temperatura +
            ' de  ' +
            valor.BM_idNevera +
            '.'),
            ' \n';
        }
      }
    }

    if (send) this.sendMail(s);
  }
  sendMail(temperatura) {
    let email = {
      to: this.localitat[0].BM_Poblacio + '@blatmarket.com',
      cc: '',
      subject: 'Temperaturas anomalas de: ' + this.date,
      body: temperatura,
      isHtml: false,
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
