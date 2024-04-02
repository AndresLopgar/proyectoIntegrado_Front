import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm; // Referencia al formulario

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

  borrar() {
    this.loginForm.reset(); // Resetea el formulario utilizando el método reset() de PrimeNG
  }

  navegaRegistro(){
    this.router.navigateByUrl('/registro');
  }
}
