import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { StoragesessionService } from './services/storagesession.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  //Variables que comproven si l'usuari que fa login es admin o tenda
  admin = false;
  tenda = true;
  constructor(private menu: MenuController) {}
  ngOnInit(): void {}

  closeMenu() {
    this.menu.close();
  }
}
