import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { nevera } from '../models/nevera';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class NeveraService {

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

  getNeveres():Observable<nevera[]>{
    let rdo=null;
    if(this.urlExists(this.API_ENDPIONT+'/nevera')){
      rdo=this.http.get<nevera[]>(this.API_ENDPIONT+'/nevera').pipe(
        catchError(this.handleError('getNevera', []))
      );
    }
    return rdo;
  }

  getNevera(id:any): Observable<nevera>{
    return this.http.get<nevera>(this.API_ENDPIONT+'/nevera?filter[]=id,eq,'+id).pipe(
      catchError(this.handleError<nevera>(`getNevera Nevera=${id} `))
    );
  }
  getNeveresbyLocalitat(idLocalitat:any):Observable<nevera[]>{
    let rdo=null;
    if(this.urlExists(this.API_ENDPIONT+'/nevera?filter[]=idLocalitat,eq,'+idLocalitat)){
      rdo=this.http.get<nevera[]>(this.API_ENDPIONT+'/nevera?filter[]=idLocalitat,eq,'+idLocalitat).pipe(
        catchError(this.handleError('getNevera', []))
      );
    }
    return rdo;
  }
 
  urlExists(url) {
    return fetch(url, {mode: "no-cors"})
       .then(res => true)
       .catch(err => false)
    }
  
}
