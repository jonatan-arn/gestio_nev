import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { usuaris } from 'src/app/models/BM_usuaris';
import { UsuarisService } from 'src/app/services/BM_usuaris.service';
import { StoragesessionService } from 'src/app/services/storagesession.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
  user: usuaris;
  EsAdmin: boolean = false;
  EsAuditor: boolean = false;
  constructor(
    private menu: MenuController,
    private stgService: StoragesessionService,
    private router: Router,
    private alertController: AlertController,
    private usuariService: UsuarisService
  ) {}

  ngOnInit() {
    this.user = this.stgService.userLog;
    if (this.user.BM_tipus == 'admin') this.EsAdmin = true;
    else this.EsAdmin = false;
    if (this.user.BM_tipus == 'auditor') this.EsAuditor = true;
    else this.EsAuditor = false;
  }
  openMenu() {
    this.menu.toggle();
  }
  addUser() {
    this.router.navigateByUrl('/user-add');
  }
  logOut() {
    this.menu.close();
    this.menu.enable(false);
    this.stgService.setSessionLoggedOut();
  }
  async delUser() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: null,
      message: 'Estas seguro que quieres borrar el usuario?',
      buttons: [{ text: 'No' }, { text: 'Si', handler: () => this.borrar() }],
    });

    await alert.present();
  }
  borrar() {
    const promesa = this.usuariService.delUser(this.user);
    promesa.then(
      () => this.logOut(),
      (err) => console.log('error: ' + err)
    );
  }
}
