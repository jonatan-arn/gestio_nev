import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { NameValidator } from 'src/app/validators/NameValidator';
import { UsuarisService } from 'src/app/services/BM_usuaris.service';
import { matchOtherValidator } from 'src/app/validators/PasswordValidator';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.page.html',
  styleUrls: ['./user-add.page.scss'],
})
export class UserAddPage implements OnInit {
  userForm = new FormGroup({
    user: new FormControl(''),
    pwd: new FormControl(''),
    pwd2: new FormControl(''),
    tipo: new FormControl(''),
  });
  user: AbstractControl;
  pwd: AbstractControl;
  pwd2: AbstractControl;
  button: boolean = true;
  tipo: AbstractControl;
  constructor(
    private alertController: AlertController,
    private userService: UsuarisService,
    private router: NavController,
    private fb: FormBuilder,
    private toastController: ToastController
  ) {
    this.userForm = this.fb.group({
      user: [
        '',
        Validators.required,
        (control) => NameValidator.isValid(control.value, this.userService),
        ,
      ],
      pwd: ['', [Validators.required]],
      pwd2: ['', [Validators.required, matchOtherValidator('pwd')]],
      tipo: ['', [Validators.required]],
    });
    this.user = this.userForm.controls['user'];
    this.pwd = this.userForm.controls['pwd'];
    this.pwd2 = this.userForm.controls['pwd2'];
    this.tipo = this.userForm.controls['tipo'];
  }

  ngOnInit() {}
  async addUser() {
    const user = this.userForm.value.user;
    const pwd = this.userForm.value.pwd;
    const tipo = this.userForm.value.tipo;
    const check = await NameValidator.isValid(user, this.userService);
    if (check == true) {
      this.alerta('Ya existe un usuario con ese nombre');
    } else {
      const promesa = this.userService.addUser(user, pwd, tipo);
      promesa.then(() => {
        this.presentToast('Usuario guardado correctamente');
        this.router.back();
      });
    }
  }
  async presentToast(missatge: string) {
    const toast = await this.toastController.create({
      message: missatge,
      duration: 2000,
    });
    toast.present();
  }
  addTipo(event) {
    this.tipo = event.detail.value;
  }
  back() {
    this.router.back();
  }
  async alerta(s) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: s,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
