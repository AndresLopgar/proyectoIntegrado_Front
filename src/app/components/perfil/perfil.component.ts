import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { usuario } from '../../model/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit{

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute) { }
  usuarioId!: number;
  usuario!: usuario;

  ngOnInit() {
    // Recuperar el ID del usuario de la ruta
    this.route.params.subscribe(params => {
        this.usuarioId = +params['id']; // Convierte el parámetro de ruta a un número
        // Ahora puedes utilizar this.usuarioId en tu lógica para cargar el perfil del usuario correspondiente
    });
    this.loadUsuarioById(this.usuarioId);
}

loadUsuarioById(id: number) {
  this.usuarioService.getUsuarioById(id).subscribe(
    (usuario: usuario) => {
      this.usuario = usuario;
      console.log('Perfil del usuario cargado exitosamente:', this.usuario);
    },
    error => {
      console.error('Error al cargar perfil del usuario:', error);
      // Manejar el error aquí
    }
  );
}

  eliminarUsuario(id: number) {
    // Preguntar al usuario si realmente quiere eliminar al usuario
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
    
    if (confirmacion) {
      // Si el usuario confirma la eliminación, llamar al servicio para eliminar al usuario
      this.usuarioService.deleteUsuario(id).subscribe(
        () => {
          console.log('Usuario eliminado exitosamente');
          // Aquí puedes redirigir a la página deseada o actualizar la lista de usuarios, etc.
        },
        error => {
          console.error('Error al eliminar usuario:', error);
          // Manejar el error aquí
        }
      );
    } else {
      // Si el usuario cancela la eliminación, no hacer nada
      console.log('Eliminación cancelada por el usuario');
    }
  }
}
