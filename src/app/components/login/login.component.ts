import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm; // Referencia al formulario

  showPassword: boolean = false;
  iconName: string = 'pi pi-lock';


  constructor(private router: Router) {}
  loginData = {
    usuario: '',
    contrasenaLogin: ''
  };

  login() {
    // Aquí puedes agregar la lógica para procesar los datos del formulario de login
    console.log('Datos de login:', this.loginData);
    this.router.navigateByUrl('/home'); // Redirige a la ruta '/home'
  }

  togglePasswordVisibility() {
    if (!this.showPassword) {
      this.showPassword = true;
      const inputField = document.getElementById('contraseñaLogin') as HTMLInputElement;
      inputField.type = 'text';
    } else {
      this.showPassword = false;
      const inputField = document.getElementById('contraseñaLogin') as HTMLInputElement;
      inputField.type = 'password';
    }
  }
  

  borrar() {
    this.loginForm.reset(); // Resetea el formulario utilizando el método reset() de PrimeNG
  }

  navegaRegistroUsuario(){
    this.router.navigateByUrl('/registro');
  }

  navegaRegistroCompania(){
    this.router.navigateByUrl('/companiaRegistro');
  }
}
