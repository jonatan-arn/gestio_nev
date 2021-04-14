import { Component, OnInit } from '@angular/core';
import { dies, NuevoDia } from '../models/BM_Dies';
import { nevera } from '../models/BM_Nevera';
import { DiesService } from '../services/BM_Dies.service';
import { NeveraService } from '../services/BM_Nevera.service';
import { StoragesessionService } from '../services/storagesession.service';
import { UsuarisService } from '../services/BM_usuaris.service';
import { formatDate } from '@angular/common';
import { MenuController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-gestio-nev',
  templateUrl: './gestio-nev.component.html',
  styleUrls: ['./gestio-nev.component.scss'],
})
export class GestioNevComponent implements OnInit {
  private todayDate;
  private yesterdayDate;
  errorMessage = '';
  private neveres: nevera[];
  private diesVista: dies[] = [];
  private dia: dies;
  private check: boolean;
  private alertS: boolean = false;
  constructor(
    private DiesService: DiesService,
    private NeveraService: NeveraService,
    private UsuariService: UsuarisService,
    private StgSesion: StoragesessionService,
    private toastController: ToastController,
    private alertController: AlertController,
    private menu: MenuController
  ) {}
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Temperatura guardada correctamente',
      duration: 2000,
    });
    toast.present();
  }

  ngOnInit(): void {
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

  getNeveres(user) {
    this.UsuariService.getUsuari(user['username']).subscribe((res) => {
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
          this.getDies(this.neveres, this.todayDate);
          this.getYesterdayDies(this.neveres, this.yesterdayDate);
        }
      );
    });
  }

  getYesterdayDies(nev, fecha) {
    for (let n of nev) {
      this.DiesService.prov(n.BM_id, fecha);
      this.DiesService.getDiesByNevera_Fecha(n.BM_id, fecha)
        .get()
        .subscribe((res) => {
          if (res.empty) {
            this.check = true;
            if (this.alertS == false) {
              this.alertTemp();
              this.alertS = true;
            }
          } else {
            this.check = false;
          }
          res.docs.forEach((doc) => {
            if (doc.exists) {
            }
          });
        });
    }
  }
  async alertTemp() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: 'Las temperaturas de ayer no estan introducidas, introducelas.',
      buttons: ['OK'],
    });

    await alert.present();
  }
  //Metode que rep una nevera i un dia
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
          } else {
            this.dia = NuevoDia(0, fecha, 0, n.BM_id);
            this.diesVista.push(this.dia);
          }
        });
    }
  }
  logOut() {
    this.StgSesion.setSessionLoggedOut();
  }
  //Metode que se ejectua quan es canvia de dia amb el datePicker
  updateDay($event) {
    const date: String = $event.detail.value.slice(0, 10);
    this.diesVista = [];
    this.check = false;
    //Recorre totes les neveres i executa el metode getDies amb la data del datePicker
    this.getDies(this.neveres, date);
  }

  //Metode per actualitza la temperatura introduida per el usuari a la BD
  updateTemp() {
    //Recorrec els dies de la vista
    console.log(this.diesVista);
    this.diesVista.forEach((valor, posicion, array) => {
      this.DiesService.addDia(valor);
    });
    this.presentToast();
    console.log(this.diesVista);
  }
  openMenu() {
    this.menu.toggle();
  }
}
