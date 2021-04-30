import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { auditories } from 'src/app/models/BM_Auditories';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';

@Component({
  selector: 'app-auditories',
  templateUrl: './auditories.page.html',
  styleUrls: ['./auditories.page.scss'],
})
export class AuditoriesPage implements OnInit {
  auditories: auditories[] = [];
  constructor(
    private menu: MenuController,
    private auditoriaService: AuditoriesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.menu.enable(true);
    this.auditoriaService.getAll().subscribe((res) => {
      this.auditories = res;
      console.log(res);
    });
  }
  openMenu() {
    this.menu.toggle();
  }
  openAuditoria() {
    this.router.navigateByUrl('/auditories-form');
  }
}
