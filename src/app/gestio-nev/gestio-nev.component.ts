import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { dies, diesToAJSON, NuevoDia } from '../models/dies';
import { nevera, neveraToAJSON } from '../models/nevera';
import { usuaris, usuarisToAJSON } from '../models/usuaris';
import { DiesService } from '../services/dies.service';
import { NeveraService } from '../services/nevera.service';
import { StoragesessionService } from '../services/storagesession.service';
import { UsuarisService } from '../services/usuaris.service';
import { formatDate } from '@angular/common';
import { ToastController } from '@ionic/angular';
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
  private dies$ = new Subject<dies[]>();
  private user: usuaris[];
  private session: any[];
  private dies: dies[];
  private diesVista: dies[] = [];
  private dia: dies;
  private myCon: Subscription;
  private check: boolean;
  private alertS: boolean = false;
  constructor(
    private DiesService: DiesService,
    private NeveraService: NeveraService,
    private UsuariService: UsuarisService,
    private StgSesion: StoragesessionService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this;
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Temperatura guardada correctament',
      duration: 2000,
    });
    toast.present();
  }

  ngOnInit(): void {
    this.yesterdayDate = new Date();
    this.yesterdayDate = new Date(
      this.yesterdayDate.setDate(this.yesterdayDate.getDate() - 1)
    );
    this.yesterdayDate = formatDate(this.yesterdayDate, 'yyyy-MM-dd', 'en');
    this.todayDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.session = this.StgSesion.getSessionLoggedIn();
    //Se accedeix a la base de dades amb el metode getUsuaria pasant-li de parametre el nom guardat en local
    this.UsuariService.getUsuari(this.session['username']).subscribe((res) => {
      this.user = usuarisToAJSON(res);
      //Se busquen les neveres que tinguen la mateixa localitat que la del usuari que ha fet login
      this.NeveraService.getNeveresbyLocalitat(
        this.user[0].idLocalitat
      ).subscribe((res) => {
        this.neveres = neveraToAJSON(res);
        for (let nev of this.neveres) {
          //Se recorren totes les neveres i se agafen els dies on estara la temperatura de aquest pasat-li el dia actual
          this.getYesterdayDies(nev, this.yesterdayDate);
          this.getDies(nev, this.todayDate);
        }
      });
    });
  }

  getYesterdayDies(nev: nevera, fecha) {
    this.myCon = this.DiesService.getDiesByNevera_Fecha(
      nev.id,
      fecha
    ).subscribe({
      next: (dia) => {
        if (diesToAJSON(dia).length == 0) {
          this.check = true;
          if (this.alertS == false) {
            this.alertTemp();
            this.alertS = true;
          }
        } else {
          this.check = false;
        }
      },

      error: (err) => (this.errorMessage = err),
    });
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
  getDies(nev: nevera, fecha) {
    //Se busquen els dies per nevera i per fecha
    this.myCon = this.DiesService.getDiesByNevera_Fecha(
      nev.id,
      fecha
    ).subscribe({
      next: (dia) => {
        //Si la llongitud del que retorna es 0  es creara un nou dia
        if (diesToAJSON(dia).length == 0) {
          this.dia = NuevoDia(null, fecha, 0, nev.id);
          //Creació del nou dia  al array de la vista
          this.diesVista.push(this.dia);
          this.dies$.next(this.diesVista);
          //Si si que retorna algo aquest dia se afegira al array de la vista
        } else {
          this.diesVista.push(diesToAJSON(dia)[0]);
          this.dies$.next(this.diesVista);
        }
      },
      error: (err) => (this.errorMessage = err),
    });
  }
  logOut() {
    this.StgSesion.setSessionLoggedOut();
  }
  //Metode que se ejectua quan es canvia de dia amb el datePicker
  updateDay($event) {
    const date: String = $event.detail.value.slice(0, 10);
    this.diesVista = [];
    this.check = false;
    for (let nev of this.neveres) {
      //Recorre totes les neveres i executa el metode getDies amb la data del datePicker
      this.getDies(nev, date);
    }
  }

  //Metode per actualitza la temperatura introduida per el usuari a la BD
  updateTemp() {
    //Recorrec els dies de la vista
    for (let dia of this.diesVista) {
      //Si el id no es null vol dir que eixe dia ja esta creat a la BD
      if (dia.id != null) {
        //Se realitza un update a la BD de datos
        this.DiesService.put(dia).subscribe(
          (Ok) => {
            if (Ok != null) this.presentToast();
            console.log(Ok);
          },
          (error) => {
            console.log('error edit:' + error);
          }
        );
      } else {
        this.DiesService.addDia(dia).subscribe(
          (OK) => {
            this.presentToast();
            console.log(OK);
          },
          (error) => {
            console.log('error add: ' + error);
          }
        );
      }
      console.log(dia);
    }
  }
}
