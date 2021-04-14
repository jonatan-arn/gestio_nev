import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Plugins, PushNotificationToken } from '@capacitor/core';
import { MenuController } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { StoragesessionService } from '../services/storagesession.service';

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

  constructor(
    private loginService: LoginService,
    private router: Router,
    private StgSesion: StoragesessionService,
    private afs: AngularFirestore,
    private menu: MenuController
  ) {}

  ngOnInit() {
    this.menu.enable(false);
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
  logIn() {
    this.loginService.login(this.user, this.pwd);
  }
}
