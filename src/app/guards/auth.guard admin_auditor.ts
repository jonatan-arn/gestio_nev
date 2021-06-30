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
//Clase que comprova que l'usuari es admin i sino no pot accedir a certes vistes
export class AuthGuardAdminAuditor implements CanActivate {
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
    if (this.storagesession.isAdmin() || this.storagesession.isAuditor()) {
      return true;
    }
    this.router.navigateByUrl('/temp');
    return false;
  }
}
