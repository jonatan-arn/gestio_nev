import { Component, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { GestioNevComponent } from './gestio-nev/gestio-nev.component';
import { ConfigPage } from './config/config.page';
import { MenuPage } from './menu/menu.page';
import { FormulariPage } from './formulari/formulari.page';
//Gestio de les rutes de la app
const routes: Routes = [
  //La ruta inicial que te redigireix al login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  //Ruta

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: GestioNevComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'config',
    component: ConfigPage,
  },
  {
    path: 'formulari',
    component: FormulariPage,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const Components = [
  LoginComponent,
  GestioNevComponent,
  ConfigPage,
  MenuPage,
  FormulariPage,
];
