import { Injectable } from '@angular/core';
import { UsuarisService } from './BM_usuaris.service';
import { Router } from '@angular/router';
import { StoragesessionService } from './storagesession.service';
import { AlertController } from '@ionic/angular';

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
  Usuari: any;

  async login(email, password) {
    this.StgSesion.setSessionLoggedOut();
    try {
      const user = this.UsuariService.getUsuari(email);
      //const user = await this.auth.login(email, password);
      user.subscribe((res) => {
        if (res.length != 0) {
          if (res[0].BM_password == password) {
            let token = 'token';
            let u = { username: email, token: token };
            if (res[0].BM_tipus == 'admin') {
              this.router.navigateByUrl('/auditories');
              this.StgSesion.setSessionLogedIn(u, true);
            } else {
              this.StgSesion.setSessionLogedIn(u, false);
              this.router.navigateByUrl('/temp');
            }
          } else {
            this.loginAlert();
          }
        } else {
          this.loginAlert();
        }
      });
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
