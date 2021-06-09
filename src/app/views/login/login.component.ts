import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Plugins, PushNotificationToken } from '@capacitor/core';
import { LoadingController, MenuController, Platform } from '@ionic/angular';
import { AppComponent } from '../../app.component';
import { UsuarisService } from '../../services/BM_usuaris.service';
import { LoginService } from '../../services/login.service';
import { StoragesessionService } from '../../services/storagesession.service';
import { AuditoriesPage } from '../auditories/auditories.page';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: string;
  pwd: string;
  token: any;
  admin: boolean;
  loading;
  constructor(
    private stgService: StoragesessionService,
    private loginService: LoginService,
    private auditoria: AuditoriesPage,
    private menu: MenuController,
    private app: AppComponent,
    private UsuariService: UsuarisService,
    private plt: Platform,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.menu.enable(false);
    if (this.plt.is('cordova')) {
      PushNotifications.requestPermission().then((result) => {
        if (result.granted) {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener(
        'registration',
        (token: PushNotificationToken) => {}
      );

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError', (error: any) => {});
    }
  }
  async logIn() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Espere',
    });
    this.loading.present();
    await this.loginService.login(this.user, this.pwd);
    this.loading.dismiss();
  }
}
