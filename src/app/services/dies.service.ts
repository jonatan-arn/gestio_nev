import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { dies } from '../models/dies';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DiesService {
  public API_ENDPIONT;
  public Config;

  constructor(private http: HttpClient, public router: Router) {
    this.Config = JSON.parse(localStorage.getItem('ConfigIp'));
    if (this.Config)
      this.API_ENDPIONT = 'http://' + this.Config.IP + ':80/api/api.php';
    else this.API_ENDPIONT = 'http://localhost:80/api/api.php';
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getDies(): Observable<dies[]> {
    let rdo = null;
    if (this.urlExists(this.API_ENDPIONT + '/dies')) {
      rdo = this.http
        .get<dies[]>(this.API_ENDPIONT + '/dies')
        .pipe(catchError(this.handleError('getDies', [])));
    }
    return rdo;
  }

  getDia(id: any): Observable<dies> {
    return this.http
      .get<dies>(this.API_ENDPIONT + '/dies?filter[]=id,eq,' + id)
      .pipe(catchError(this.handleError<dies>(`getDia dies=${id} `)));
  }
  getDiesByNevera_Fecha(id: any, dia: any): Observable<dies> {
    let rdo = null;
    if (
      this.urlExists(
        this.API_ENDPIONT +
          '/dies?filter[]=idNevera,eq,' +
          id +
          '&filter[]=dia,eq,' +
          dia +
          '&satisfy=all'
      )
    ) {
      rdo = this.http
        .get<dies[]>(
          this.API_ENDPIONT +
            '/dies?filter[]=idNevera,eq,' +
            id +
            '&filter[]=dia,eq,' +
            dia +
            '&satisfy=all'
        )
        .pipe(catchError(this.handleError('getDies', [])));
    }
    return rdo;
  }

  put(dia) {
    // Modificar producto en la BD
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .put(this.API_ENDPIONT + '/dies/' + dia.id, dia, {
        headers: headers,
      })
      .pipe(catchError(this.handleError('put', dia)));
  }
  addDia(dia) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.API_ENDPIONT + '/dies', dia, {
      headers: headers,
    });
  }
  eliminar(dia) {
    return this.http
      .delete(this.API_ENDPIONT + '/dies/' + dia.id)
      .pipe(catchError(this.handleError('del ', dia)));
  }

  urlExists(url) {
    return fetch(url, { mode: 'no-cors' })
      .then((res) => true)
      .catch((err) => false);
  }
}
