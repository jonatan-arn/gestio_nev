import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: string;
  pwd: string;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {}
  logIn() {
    this.loginService.login(this.user, this.pwd);
  }
}
