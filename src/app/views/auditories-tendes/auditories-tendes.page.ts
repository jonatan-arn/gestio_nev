import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  MenuController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { localitat } from 'src/app/models/BM_Localitat';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { LocalitatService } from 'src/app/services/BM_Localitat.service';
import { StoragesessionService } from 'src/app/services/storagesession.service';

@Component({
  selector: 'app-auditories-tendes',
  templateUrl: './auditories-tendes.page.html',
  styleUrls: ['./auditories-tendes.page.scss'],
})
export class AuditoriesTendesPage implements OnInit {
  admin;
  localitats$: Observable<localitat[]>;
  auditories$ = this.auditoriaService.auditories_tendes;
  loading;

  constructor(
    private menu: MenuController,
    private auditoriaService: AuditoriesService,
    private stgService: StoragesessionService,
    private menuView: AppComponent,
    private route: Router,
    private localitatService: LocalitatService,
    public loadingController: LoadingController
  ) {}

  async ngOnInit() {
    this.menu.close();
    if (this.stgService.isAdmin()) {
      this.menuView.admin = true;
      this.admin = true;
    } else {
      this.menuView.admin = false;
      this.admin = false;
    }

    this.menu.enable(true);
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Espere',
    });
    this.loading.present();
    this.loadData();
  }
  async loadData() {
    this.localitats$ = this.localitatService
      .getAll()
      .pipe(
        map((action) => action.map((a) => a.payload.doc.data() as localitat))
      );
    this.loading.dismiss();
  }
  async generatePdf() {
    //metode per a genera un pdf
  }
  doubleClick(event, auditoria) {
    if (event.tapCount == 2) {
      this.auditoriaService.setEsView(true);

      this.auditoriaService.setAuditoria(auditoria);

      this.route.navigateByUrl('/auditories-test');
    }
  }
}
