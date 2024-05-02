import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../model/usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router) { }
  
  usuarioId!: number;
  usuario!: Usuario;
  usuarioIdFromLocalStorage!: number;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.usuarioId = +params['id'];
      // Cargar el perfil del usuario utilizando el ID
      this.loadUsuarioById(this.usuarioId);
    });
    const usuarioLocalStorage = localStorage.getItem('usuario');
    if (usuarioLocalStorage) {
      const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
      this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
    }
  }

  loadUsuarioById(id: number) {
    this.usuarioService.getUsuarioById(id).subscribe(
      (usuario: Usuario) => {
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

  cerrarSesion() {
    // Preguntar al usuario si realmente quiere cerrar la sesión
    const confirmacion = window.confirm('¿Estás seguro de que quieres cerrar la sesión?');
    
    if (confirmacion) {
      // Eliminar el usuario del Local Storage
      localStorage.removeItem('usuario');
      // Establecer manualmente el tipo de usuario como "noRegistrado"
      localStorage.setItem('tipoUsuario', 'noRegistrado');
      console.log('Sesión cerrada exitosamente');
      // Redirigir a la página de inicio de sesión u otra página apropiada después de cerrar sesión
      this.router.navigateByUrl('/login');
    } else {
      // Si el usuario cancela, no hacer nada
      console.log('Cierre de sesión cancelado por el usuario');
    }
  }
  
  
}
