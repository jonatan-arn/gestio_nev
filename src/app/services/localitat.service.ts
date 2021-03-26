import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { localitat } from '../models/localitat';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class LocalitatService {

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

  getLocalitats():Observable<localitat[]>{
    let rdo=null;
    if(this.urlExists(this.API_ENDPIONT+'/localitat')){
      rdo=this.http.get<localitat[]>(this.API_ENDPIONT+'/localitat').pipe(
        catchError(this.handleError('getLocalitats', []))
      );
    }
    return rdo;
  }

  getLocalitat(id:any): Observable<localitat>{
    return this.http.get<localitat>(this.API_ENDPIONT+'/localitat?filter[]=id,eq,'+id).pipe(
      catchError(this.handleError<localitat>(`getLocalitat localitat=${id} `))
    );
  }

 
  urlExists(url) {
    return fetch(url, {mode: "no-cors"})
       .then(res => true)
       .catch(err => false)
    }
  
}
