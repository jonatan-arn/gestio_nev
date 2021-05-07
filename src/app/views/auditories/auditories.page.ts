import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  MenuController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { auditories } from 'src/app/models/BM_Auditories';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { StoragesessionService } from 'src/app/services/storagesession.service';
import { AuditoriesFormPage } from '../auditories-form/auditories-form.page';
import { PopoverPagePage } from '../popover-page/popover-page.page';

@Component({
  selector: 'app-auditories',
  templateUrl: './auditories.page.html',
  styleUrls: ['./auditories.page.scss'],
})
export class AuditoriesPage implements OnInit {
  @ViewChild('cardElement') cardElement: ElementRef;
  admin;

  auditories$ = this.auditoriaService.auditorias;
  constructor(
    private menu: MenuController,
    private auditoriaService: AuditoriesService,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private stgService: StoragesessionService,
    private menuView: AppComponent,
    private route: Router
  ) {}

  ngOnInit() {
    if (this.stgService.isAdmin()) {
      this.menuView.admin = true;
      this.admin = true;
    } else {
      this.menuView.admin = false;
      this.admin = false;
    }

    console.log(this.admin);
    this.menu.enable(true);
  }
  doubleClick(event, auditoria) {
    if (event.tapCount == 2) {
      this.auditoriaService.setAuditoria(auditoria);
      this.route.navigateByUrl('/auditories-test');
    }
  }
  openMenu() {
    this.menu.toggle();
  }
  async openAuditoria() {
    const modal = await this.modalController.create({
      component: AuditoriesFormPage,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }
  async optionAudiotoria(event, auditoria) {
    const popover = await this.popoverController.create({
      component: PopoverPagePage,
      cssClass: 'my-custom-class',
      event: event,
      translucent: true,
      componentProps: { aud: auditoria },
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }
}
