import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';

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

  constructor(private router: Router, private usuarioService: UsuarioService) { 
}
  
usuario: Usuario = {
  id: 0, // Puedes dejarlo como 0 si el ID se generará automáticamente en el backend
  nombre: '',
  edad: 0,
  correoElectronico: '',
  contrasena: '',
  profesion: '',
  fechaRegistro: '', // Debe ser establecido por el backend
  fotoPerfil: '', // Puedes dejarlo vacío si la foto no se proporciona en este paso
  tipoUsuario: 'estandar', // Dependiendo de tu lógica de negocio
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
    this.usuario.fechaRegistro = new Date().toISOString();
    // Aquí puedes agregar la lógica para procesar los datos del formulario de registro
    console.log('Datos de registro:', this.usuario);
  
    // Llamar al servicio para registrar al usuario
    this.usuarioService.createUsuario(this.usuario).subscribe(
      id => {
        console.log(`Usuario registrado con ID: ${id}`);
        // Redirigir a la página de inicio después de que el usuario se registre exitosamente
        this.router.navigateByUrl('/login');
      },
      error => {
        console.error('Error al registrar usuario:', error);
        // Manejar el error aquí
      }
    );
  }
  

  borrar() {
    this.loginForm.reset(); // Resetea el formulario utilizando el método reset() de PrimeNG
  }

  navegaLogin(){
    this.router.navigateByUrl('/login'); // Redirige a la ruta '/home'
  }
}
