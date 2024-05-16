import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ButtonModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  @ViewChild('registroForm') loginForm!: NgForm; // Referencia al formulario
  showPassword: boolean = false;
  mostrarDialogo: boolean = false;
  imagenes: string[] = [   // Rutas de las imágenes
    '../../../assets/perfiles/usuarios/imagenHombre1.png',
    '../../../assets/perfiles/usuarios/imagenMujer1.png',
    '../../../assets/perfiles/usuarios/imagenHombre2.png',
    '../../../assets/perfiles/usuarios/imagenMujer2.png',
    '../../../assets/perfiles/usuarios/imagenHombre3.png',
    '../../../assets/perfiles/usuarios/imagenMujer3.png',
  ];
  fotoPerfilNula: boolean = true;

  constructor(private router: Router, private usuarioService: UsuarioService) { 
}
  
usuario: Usuario = {
  id: 0, // Puedes dejarlo como 0 si el ID se generará automáticamente en el backend
  nombre: '',
  edad: 0,
  correoElectronico: '',
  contrasena: '',
  profesion: '',
  fechaRegistro: '', 
  fotoPerfil: '',
  tipoUsuario: 'estandar', // Dependiendo de tu lógica de negocio
  companiaSeguida: 0
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

    this.usuarioService.createUsuario(this.usuario).subscribe(
      id => {
        console.log(`Usuario registrado con ID: ${id}`);
        this.router.navigateByUrl('/login');
        Swal.fire({
          icon: 'success',
          title: 'Registro de usuario exitoso',
          text: '¡Inicia sesión para empezar a navegar!'
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Comprueba que los datos introducidos sean correctos'
        });
      }
    );
  }

  elegirFotoPerfil(indice: number) {
    this.usuario.fotoPerfil = this.imagenes[indice];
    this.fotoPerfilNula = false;
    this.cerrarDialogo();
  }
  
    mostrarIconos() {
      this.mostrarDialogo = true;
  }

  cerrarDialogo() {
      this.mostrarDialogo = false;
  }

  borrar() {
    this.loginForm.reset(); // Resetea el formulario utilizando el método reset() de PrimeNG
  }

  navegaLogin(){
    this.router.navigateByUrl('/login'); // Redirige a la ruta '/home'
  }
}
