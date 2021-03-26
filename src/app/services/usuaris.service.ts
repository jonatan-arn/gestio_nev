import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { usuaris } from '../models/usuaris';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UsuarisService {

  public API_ENDPIONT;
  public Config;

  constructor(private http: HttpClient, public router:Router) {

    this.Config=JSON.parse(localStorage.getItem('ConfigIp'));
    if (this.Config)
      this.API_ENDPIONT = 'http://'+this.Config.IP+':80/api/api.php';
    else
      this.API_ENDPIONT = 'http://localhost:80/api/api.php';
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {    
      this.router.navigateByUrl('/config');
      return of(result as T);
    };
  }

  getUsuaris():Observable<usuaris[]>{
    let rdo=null;
    if(this.urlExists(this.API_ENDPIONT+'/usuaris')){
      rdo=this.http.get<usuaris[]>(this.API_ENDPIONT+'/usuaris').pipe(
        catchError(this.handleError('getUsuaris', []))
      );
    }
    return rdo;
  }

  getUsuari(user:any): Observable<usuaris>{
    return this.http.get<usuaris>(this.API_ENDPIONT+'/usuaris?filter[]=user,eq,'+user).pipe(
      catchError(this.handleError<usuaris>(`getUsuari Usuari=${user} `))
    );
  }

 
  urlExists(url) {
    return fetch(url, {mode: "no-cors"})
       .then(res => true)
       .catch(err => false)
    }
  
}
