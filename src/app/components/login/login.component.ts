import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

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
  usuarios: any;


  constructor(private router: Router, private usuarioService: UsuarioService) {}
  loginData = {
    usuario: '',
    contrasenaLogin: ''
  };

  login() {
    this.usuarioService.getAllUsuarios().subscribe(
      data => {
        this.usuarios = data;
        const usuarioEncontrado = this.usuarios.find((usuario: any) => 
          usuario.nombre === this.loginData.usuario && usuario.contrasena === this.loginData.contrasenaLogin
        );

        if (usuarioEncontrado) {
          console.log('Inicio de sesión exitoso.');
          this.usuarioService.usuarioEncontrado = usuarioEncontrado; // Guardar usuario
          this.router.navigateByUrl('/perfil/' + usuarioEncontrado.id);
        } else {
          console.log('Nombre de usuario o contraseña no válidos.');
        }
      },
      error => {
        console.log('Error al recuperar usuarios:', error);
      }
    );
  }

  getAllUsuario(){
    this.usuarioService.getAllUsuarios().subscribe(
      data => {
        this.usuarios = data;
        console.log(this.usuarios);
      },
      error => {
        console.log('Error al recuperar usuarios:', error);
      }
    );
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
