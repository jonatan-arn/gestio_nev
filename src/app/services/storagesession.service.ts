import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Isession } from '../models/Isession';

@Injectable({
  providedIn: 'root',
})
export class StoragesessionService {
  private isUserLoggedIn: boolean = false;
  public sessionLogged: Isession;
  private isUserAdmin: boolean = false;
  constructor(private router: Router) {}

  setSessionLogedIn(session: Isession, isAdmin: boolean) {
    this.isUserAdmin = isAdmin;
    this.isUserLoggedIn = true;
    this.sessionLogged = session;
    sessionStorage.setItem('currentUser', JSON.stringify(session));
  }

  getSessionLoggedIn() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }
  getUsuari(): Observable<Isession> {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }
  isAuthenticated(): boolean {
    return this.isUserLoggedIn;
  }
  isAdmin(): boolean {
    return this.isUserAdmin;
  }

  setSessionLoggedOut() {
    sessionStorage.removeItem('currentUser');
    this.sessionLogged = null;
    this.isUserLoggedIn = false;
    this.router.navigateByUrl('/');
  }
}
