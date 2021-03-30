import { Injectable } from '@angular/core';
import { UsuarisService } from './usuaris.service';
import { Router } from '@angular/router';
import { StoragesessionService } from './storagesession.service';
import { usuarisToAJSON } from '../models/usuaris';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private api: UsuarisService,
    private router: Router,
    private StgSesion: StoragesessionService,
    private alertController: AlertController
  ) {}

  rdo = false;
  Usuari: any;

  login(user: string, password: string) {
    this.StgSesion.setSessionLoggedOut();
    this.api.getUsuari(user).subscribe(
      (res) => {
        this.Usuari = usuarisToAJSON(res);
        if (this.Usuari.length > 0) {
          if (password == this.Usuari[0].password) {
            let token = 'token';
            let u = { username: user, token: token };
            this.StgSesion.setSessionLogedIn(u);
            this.router.navigateByUrl('/home');
          } else {
            this.loginAlert();
          }
        }
      },
      (err) => {}
    );
  }

  async loginAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error login',
      message: 'Usuario o contraseña incorrectos.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
