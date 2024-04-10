import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ButtonModule, FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  @ViewChild('registroForm') loginForm!: NgForm; // Referencia al formulario
  showPassword: boolean = false;

  constructor(private router: Router) {}
  registroData = {
    nombre: '',
    edad:'',
    profesion:'',
    correo: '',
    contrasena: '',
    foto: null // Aquí podrías manejar la foto como un objeto o cualquier otra representación que necesites
  };

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

  registro() {
    // Aquí puedes agregar la lógica para procesar los datos del formulario de registro
    console.log('Datos de registro:', this.registroData);
    this.router.navigateByUrl('/home'); // Redirige a la ruta '/home'
  }

  borrar() {
    this.loginForm.reset(); // Resetea el formulario utilizando el método reset() de PrimeNG
  }

  navegaLogin(){
    this.router.navigateByUrl('/login'); // Redirige a la ruta '/home'
  }
}
