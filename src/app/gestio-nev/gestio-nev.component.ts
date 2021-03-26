import { Component, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, throwError } from 'rxjs';
import { dies, diesToAJSON, NewDia, NuevoDia } from '../models/dies';
import { nevera, neveraToAJSON } from '../models/nevera';
import { usuaris, usuarisToAJSON } from '../models/usuaris';
import { DiesService } from '../services/dies.service';
import { NeveraService } from '../services/nevera.service';
import { StoragesessionService } from '../services/storagesession.service';
import { UsuarisService } from '../services/usuaris.service';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestio-nev',
  templateUrl: './gestio-nev.component.html',
  styleUrls: ['./gestio-nev.component.scss'],
})
export class GestioNevComponent implements OnInit {
  private todayDate;
  private maxDate;
  errorMessage = '';
  public DiaForm: FormGroup;
  public neveres: nevera[];
  public neveres$ = new Subject<nevera[]>();
  public dies$ = new Subject<dies[]>();
  public user: usuaris[];
  public session: any[];
  public dies: dies[];
  public diesVista: dies[] = [];
  public dia: dies;
  public aux: dies[];
  private myCon: Subscription;
  constructor(
    private DiesService: DiesService,
    private NeveraService: NeveraService,
    private UsuariService: UsuarisService,
    private StgSesion: StoragesessionService
  ) {}

  ngOnInit(): void {
    this.todayDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.maxDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.session = this.StgSesion.getSessionLoggedIn();
    this.UsuariService.getUsuari(this.session['username']).subscribe((res) => {
      this.user = usuarisToAJSON(res);
      this.NeveraService.getNeveresbyLocalitat(
        this.user[0].idLocalitat
      ).subscribe((res) => {
        this.neveres = neveraToAJSON(res);
        for (let nev of this.neveres) {
          this.getDies(nev, formatDate(new Date(), 'yyyy-MM-dd', 'en'));
        }
      });
    });
  }

  getDies(nev: nevera, fecha) {
    this.myCon = this.DiesService.getDiesByNevera_Fecha(
      nev.id,
      fecha
    ).subscribe({
      next: (dia) => {
        if (diesToAJSON(dia).length == 0) {
          this.dia = NuevoDia(null, fecha, 0, nev.id);
          this.diesVista.push(this.dia);
          this.dies$.next(this.diesVista);
        } else {
          this.diesVista.push(diesToAJSON(dia)[0]);
          this.dies$.next(this.diesVista); // Emite evento que esta lleno !!
        }
      },
      error: (err) => (this.errorMessage = err),
    });
  }
  updateDay($event) {
    const date: String = $event.detail.value.slice(0, 10);
    this.diesVista = [];
    for (let nev of this.neveres) {
      this.getDies(nev, date);
    }
  }
  updateTemp() {
    for (let dia of this.diesVista) {
      if (dia.id != null) {
        this.DiesService.put(dia).subscribe(
          (Ok) => {
            console.log(dia);
            // Modifica la BD
            console.log(Ok); // 1 indica ok
          },
          (error) => {
            console.log('error edit:' + error);
          }
        );
      } else {
        this.DiesService.addDia(dia).subscribe(
          (OK) => {
            console.log(OK);
          },
          (error) => {
            console.log('error add: ' + error);
          }
        );
      }
      console.log(dia);
    }
  }
}
