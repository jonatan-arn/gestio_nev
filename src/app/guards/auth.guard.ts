import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StoragesessionService } from '../services/storagesession.service';
@Injectable({
  providedIn: 'root',
})
//Clase que comprova que l'usuari ha fet login i sino no pot accedir a les vistes
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private storagesession: StoragesessionService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.storagesession.isAuthenticated()) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}
