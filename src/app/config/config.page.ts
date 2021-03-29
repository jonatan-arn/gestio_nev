import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  public ConfigIp = { IP: 'localhost' };
  public ConfigRef = { Ref: 2000 };
  public ConfigPaso = { Paso: 5 };
  public IP = 'localhost';
  public REF = 2000;
  public PASO = 5;

  constructor(public router: Router) {
    //Set ip on form
    this.ConfigIp = JSON.parse(localStorage.getItem('configIp'));
    if (this.ConfigIp) this.IP = this.ConfigIp.IP;
    //Set refresh rate on form
    this.ConfigRef = JSON.parse(localStorage.getItem('configRef'));
    if (this.ConfigRef) this.REF = this.ConfigRef.Ref;
    //Set paso?? on form
    this.ConfigPaso = JSON.parse(localStorage.getItem('configPaso'));
    if (this.ConfigPaso) this.PASO = this.ConfigPaso.Paso;
  }

  ngOnInit() {}

  FormSubmit() {
    //save ip on localStorage
    this.ConfigIp = { IP: this.IP };
    localStorage.setItem('ConfigIp', JSON.stringify(this.ConfigIp));
    //save refresh rate on localStorage
    this.ConfigRef = { Ref: this.REF };
    localStorage.setItem('configRef', JSON.stringify(this.ConfigRef));
    //save paso?? on localStorage
    this.ConfigPaso = { Paso: this.PASO };
    localStorage.setItem('configPaso', JSON.stringify(this.ConfigPaso));
    //return to main page
    this.router.navigate(['/home']);
  }

  //For exit button, just in case
  /*exit(){
    window.close();
  }*/
}
