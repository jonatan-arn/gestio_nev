import { Component, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { GestioNevComponent } from './views/gestio-nev/gestio-nev.component';
import { FormulariPage } from './views/formulari/formulari.page';
import { AuditoriesPage } from './views/auditories/auditories.page';
import { AuthGuardAdmin } from './guards/auth.guard admin';
import { AuditoriesFormPage } from './views/auditories-form/auditories-form.page';
import { PreguntaPage } from './views/pregunta/pregunta.page';
import { AuditoriesTestPage } from './views/auditories-test/auditories-test.page';
import { AuditoriesTendesPage } from './views/auditories-tendes/auditories-tendes.page';
import { UserInfoPage } from './views/user-info/user-info.page';
import { AuthGuardAdminAuditor } from './guards/auth.guard admin_auditor';
import { UserAddPage } from './views/user-add/user-add.page';
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
    path: 'formulari',
    component: FormulariPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'auditories',
    component: AuditoriesPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'auditories-form',
    component: AuditoriesFormPage,
    canActivate: [AuthGuard, AuthGuardAdminAuditor],
  },
  {
    path: 'auditories-test',
    component: AuditoriesTestPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'auditories-tendes',
    component: AuditoriesTendesPage,
    canActivate: [AuthGuard, AuthGuardAdminAuditor],
  },
  {
    path: 'user-info',
    component: UserInfoPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-add',
    component: UserAddPage,
    canActivate: [AuthGuard, AuthGuardAdmin],
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
  AuditoriesPage,
  FormulariPage,
  AuditoriesFormPage,
  PreguntaPage,
  AuditoriesTestPage,
  AuditoriesTendesPage,
  UserInfoPage,
  UserAddPage,
];
