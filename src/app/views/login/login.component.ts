import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Plugins, PushNotificationToken } from '@capacitor/core';
import { MenuController, Platform } from '@ionic/angular';
import { AppComponent } from '../../app.component';
import { UsuarisService } from '../../services/BM_usuaris.service';
import { LoginService } from '../../services/login.service';
import { StoragesessionService } from '../../services/storagesession.service';

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
  constructor(
    private loginService: LoginService,
    private router: Router,
    private StgSesion: StoragesessionService,
    private afs: AngularFirestore,
    private menu: MenuController,
    private app: AppComponent,
    private UsuariService: UsuarisService,
    private plt: Platform
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
  logIn() {
    this.loginService.login(this.user, this.pwd).then(() => {
      const user = this.UsuariService.getUsuari(this.user);
      user.subscribe((res) => {
        if (res[0].BM_tipus == 'admin') {
          this.app.admin = true;
        } else {
          this.app.admin = false;
        }
      });
    });
  }
}
