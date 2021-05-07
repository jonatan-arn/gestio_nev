import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { StoragesessionService } from './services/storagesession.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  admin = false;
  tenda = true;
  constructor(
    private stgService: StoragesessionService,
    private menu: MenuController
  ) {}
  ngOnInit(): void {}
  logOut() {
    this.menu.close();
    this.menu.enable(false);
    this.stgService.setSessionLoggedOut();
  }
}
