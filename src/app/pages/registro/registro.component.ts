import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ButtonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  constructor(private router: Router) {}
  registroData = {
    nombre: '',
    correo: '',
    contraseña: '',
    foto: null // Aquí podrías manejar la foto como un objeto o cualquier otra representación que necesites
  };

  registro() {
    // Aquí puedes agregar la lógica para procesar los datos del formulario de registro
    console.log('Datos de registro:', this.registroData);
    // Puedes hacer una petición HTTP aquí para enviar los datos al servidor, por ejemplo
  }

  borrar(formulario: string) {
      this.registroData = {
        nombre: '',
        correo: '',
        contraseña: '',
        foto: null
      };
  }

  navegaLogin(){
    this.router.navigateByUrl('/login'); // Redirige a la ruta '/home'
  }
}
