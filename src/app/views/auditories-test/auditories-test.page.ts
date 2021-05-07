import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { auditories } from 'src/app/models/BM_Auditories';
import { checkbox } from 'src/app/models/BM_checkbox';
import { numero } from 'src/app/models/BM_numero';
import { preguntaCreacio } from 'src/app/models/BM_PreguntaCreacio';
import { radio } from 'src/app/models/BM_Radio';
import { si_no } from 'src/app/models/BM_si_no';
import { slider } from 'src/app/models/BM_slider';
import { smile } from 'src/app/models/BM_smile';
import { text } from 'src/app/models/BM_text';
import { AuditoriesService } from 'src/app/services/BM_Auditories.service';

@Component({
  selector: 'app-auditories-test',
  templateUrl: './auditories-test.page.html',
  styleUrls: ['./auditories-test.page.scss'],
})
export class AuditoriesTestPage implements OnInit {
  aud: auditories;
  Arraypreguntes: preguntaCreacio[] = [];
  Arraycheckbox: checkbox[] = [];
  Arrayradio: radio[] = [];
  Arraytext: text[] = [];
  Arraynumeros: numero[] = [];
  Arraysmile: smile[] = [];
  Arrayslider: slider[] = [];
  Arraysi_no: si_no[] = [];
  constructor(
    private AuditoriesService: AuditoriesService,
    private router: NavController
  ) {}

  ngOnInit() {
    this.aud = this.AuditoriesService.getAuditoria();
    this.AuditoriesService.preguntes.subscribe((res) => {
      for (let i = 0; i < res.length; i++)
        if (this.aud.BM_id == res[i].BM_auditoriaId)
          this.Arraypreguntes.push(res[i]);
    });

    this.AuditoriesService.checkbox.subscribe((res) => {
      if (res[0] != undefined)
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < this.Arraypreguntes.length; j++) {
            if (res[i].BM_id == this.Arraypreguntes[j].BM_id)
              this.Arraycheckbox.push(res[i]);
          }
        }
    });

    this.AuditoriesService.radio.subscribe((res) => {
      if (res[0] != undefined)
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < this.Arraypreguntes.length; j++) {
            if (res[i].BM_id == this.Arraypreguntes[j].BM_id)
              this.Arrayradio.push(res[i]);
          }
        }
    });

    this.AuditoriesService.slider.subscribe((res) => {
      if (res[0] != undefined)
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < this.Arraypreguntes.length; j++) {
            if (res[i].BM_id == this.Arraypreguntes[j].BM_id)
              this.Arrayslider.push(res[i]);
          }
        }
    });

    this.AuditoriesService.smile.subscribe((res) => {
      if (res[0] != undefined)
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < this.Arraypreguntes.length; j++) {
            if (res[i].BM_id == this.Arraypreguntes[j].BM_id)
              this.Arraysmile.push(res[i]);
          }
        }
    });

    this.AuditoriesService.siNo.subscribe((res) => {
      if (res[0] != undefined)
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < this.Arraypreguntes.length; j++) {
            if (res[i].BM_id == this.Arraypreguntes[j].BM_id)
              this.Arraysi_no.push(res[i]);
          }
        }
    });

    this.AuditoriesService.text.subscribe((res) => {
      if (res[0] != undefined)
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < this.Arraypreguntes.length; j++) {
            if (res[i].BM_id == this.Arraypreguntes[j].BM_id)
              this.Arraytext.push(res[i]);
          }
        }
    });

    this.AuditoriesService.numero.subscribe((res) => {
      if (res[0] != undefined)
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < this.Arraypreguntes.length; j++) {
            if (res[i].BM_id == this.Arraypreguntes[j].BM_id)
              this.Arraynumeros.push(res[i]);
          }
        }
    });
  }
  back() {
    this.router.back();
  }
}
