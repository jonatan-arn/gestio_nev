import { Injectable } from '@angular/core';
import { UsuarisService } from './BM_usuaris.service';
import { Router } from '@angular/router';
import { StoragesessionService } from './storagesession.service';
import { AlertController } from '@ionic/angular';
import { usuaris } from '../models/BM_usuaris';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private router: Router,
    private StgSesion: StoragesessionService,
    private alertController: AlertController,
    private UsuariService: UsuarisService
  ) {}

  rdo = false;
  Usuari: usuaris;

  async login(email, password): Promise<boolean> {
    this.StgSesion.setSessionLoggedOut();
    try {
      const user = await this.UsuariService.getUsuari(email).get().toPromise();
      if (user.size === 0) {
        this.loginAlert();
        return true;
      } else {
        this.Usuari = user.docs[0].data();
        this.StgSesion.userLog = this.Usuari;
        if (this.Usuari.BM_password === password) {
          let token = 'token';
          let u = { username: email, token: token };
          if (
            this.Usuari.BM_tipus === 'admin' ||
            this.Usuari.BM_tipus == 'auditor'
          ) {
            this.router.navigateByUrl('/auditories');
            this.StgSesion.setSessionLogedIn(u);
            return true;
          } else {
            this.StgSesion.setSessionLogedIn(u);
            this.router.navigateByUrl('/temp');
            return true;
          }
        } else {
          this.loginAlert();
          return true;
        }
      }
    } catch (error) {
      console.log('Error->', error);
    }
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
