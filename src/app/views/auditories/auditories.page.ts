import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonSelect,
  LoadingController,
  MenuController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { auditories } from 'src/app/models/BM_Auditories';
import { localitat } from 'src/app/models/BM_Localitat';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';
import { LocalitatService } from 'src/app/services/BM_Localitat.service';
import { StoragesessionService } from 'src/app/services/storagesession.service';
import { AuditoriesFormPage } from '../auditories-form/auditories-form.page';
import { PopoverPagePage } from '../popover-page/popover-page.page';

@Component({
  selector: 'app-auditories',
  templateUrl: './auditories.page.html',
  styleUrls: ['./auditories.page.scss'],
})
export class AuditoriesPage implements OnInit {
  admin;
  loading;
  auditories$;
  tendes$: Observable<localitat[]>;

  auditoria: auditories;
  tendes: localitat[];
  public esView: boolean;
  @ViewChild('mySelect', { static: false }) selectRef: IonSelect;

  constructor(
    private menu: MenuController,
    private auditoriaService: AuditoriesService,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private stgService: StoragesessionService,
    private menuView: AppComponent,
    private route: Router,
    private loadingController: LoadingController,
    private localitatService: LocalitatService
  ) {}

  ngOnInit() {
    //this.loadingAlert();
    //Carregar les auditories i les tendes
    this.auditories$ = this.auditoriaService.auditorias;
    this.tendes$ = this.localitatService
      .getAll()
      .pipe(
        map((action) => action.map((a) => a.payload.doc.data() as localitat))
      );
    //Ordenar les tendes
    this.tendes$ = this.tendes$.pipe(
      map((res) => {
        res.sort((t1, t2) => {
          const name1 = t1.BM_ID;
          const name2 = t2.BM_ID;
          if (name1 > name2) {
            return 1;
          }
          if (name1 < name2) {
            return -1;
          }
          return 0;
        });
        return res;
      })
    );
    //Comprovar si es administrador
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
  //Al doble click en la auditoria obri la llista de id de tendes
  doubleClick(event, auditoria) {
    if (this.admin)
      if (event.tapCount == 2) {
        this.selectRef.value = 0;
        this.selectRef.open();
        this.auditoria = auditoria;
      }
  }
  //Navega a una vista on es pot rellenar la auditoria seleccionada
  navAuditoria(event) {
    if (event.detail.value != 0) {
      console.log(event.detail.value);
      this.auditoriaService.setEsView(false);
      this.auditoria.BM_tendaId = event.detail.value;
      this.auditoriaService.setAuditoria(this.auditoria);
      this.auditoriaService;
      this.route.navigateByUrl('/auditories-test');
    }
  }
  openMenu() {
    this.menu.toggle();
  }
  async loadingAlert() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Espere',
    });
    this.loading.present();
  }
  async openAuditoria() {
    const modal = await this.modalController.create({
      component: AuditoriesFormPage,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

  //Metode del boto "+" per a crear un nova auditoria
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
