import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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
  constructor(
    private menu: MenuController,
    private stgService: StoragesessionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.stgService.userLog;
    if (this.user.BM_tipus == 'admin') this.EsAdmin = true;
    else this.EsAdmin = false;
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
}
