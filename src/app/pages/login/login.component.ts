import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router: Router) {}
  loginData = {
    usuario: '',
    contraseñaLogin: ''
  };

  login() {
    // Aquí puedes agregar la lógica para procesar los datos del formulario de login
    console.log('Datos de login:', this.loginData);
    this.router.navigateByUrl('/home'); // Redirige a la ruta '/home'
  }

  borrar(formulario: string) {
      this.loginData = {
        usuario: '',
        contraseñaLogin: ''
      };
  }

  navegaRegistro(){
    this.router.navigateByUrl('/registro');
  }
}
