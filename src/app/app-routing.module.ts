import { Component, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { GestioNevComponent } from './views/gestio-nev/gestio-nev.component';
import { ConfigPage } from './views/config/config.page';
import { FormulariPage } from './views/formulari/formulari.page';
import { AuditoriesPage } from './views/auditories/auditories.page';
import { AuthGuardAdmin } from './guards/auth.guard admin';
import { AuditoriesFormPage } from './views/auditories-form/auditories-form.page';
import { PreguntaPageRoutingModule } from './views/pregunta/pregunta-routing.module';
import { PreguntaPage } from './views/pregunta/pregunta.page';
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
    path: 'temp',
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
  {
    path: 'auditories',
    component: AuditoriesPage,
    canActivate: [AuthGuard, AuthGuardAdmin],
  },
  {
    path: 'auditories-form',
    component: AuditoriesFormPage,
    canActivate: [AuthGuard, AuthGuardAdmin],
  },
  {
    path: 'popover-page',
    loadChildren: () => import('./views/popover-page/popover-page.module').then( m => m.PopoverPagePageModule)
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
  AuditoriesPage,
  FormulariPage,
  AuditoriesFormPage,
  PreguntaPage,
];
