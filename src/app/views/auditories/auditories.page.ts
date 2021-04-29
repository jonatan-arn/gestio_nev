import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-auditories',
  templateUrl: './auditories.page.html',
  styleUrls: ['./auditories.page.scss'],
})
export class AuditoriesPage implements OnInit {
  constructor(private menu: MenuController) {}

  ngOnInit() {
    this.menu.enable(true);
  }
  openMenu() {
    this.menu.toggle();
  }
}
