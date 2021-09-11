import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { usuaris } from '../models/BM_usuaris';
import { Isession } from '../models/Isession';

@Injectable({
  providedIn: 'root',
})
export class StoragesessionService {
  private isUserLoggedIn: boolean = false;
  public sessionLogged: Isession;
  private isUserAdmin: boolean = false;
  private isUserAuditor: boolean = false;

  public userLog: usuaris;
  constructor(private router: Router) {}

  setSessionLogedIn(session: Isession) {
    if (this.userLog.BM_tipus == 'admin') this.isUserAdmin = true;
    else if (this.userLog.BM_tipus == 'auditor') this.isUserAuditor = true;
    else {
      this.isUserAdmin = false;
      this.isUserAuditor = false;
    }
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
  isAuditor(): boolean {
    return this.isUserAuditor;
  }

  setSessionLoggedOut() {
    sessionStorage.removeItem('currentUser');
    this.sessionLogged = null;
    this.isUserLoggedIn = false;
    this.router.navigateByUrl('/');
  }
}
