import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../model/usuario';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router) { }
  
  usuarioId!: number;
  usuario!: Usuario;
  usuarioIdFromLocalStorage!: number;
  mostrandoFormularioModificar: boolean = false;

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

  async eliminarUsuario(id: number) {
     // Mostrar un cuadro de diálogo de confirmación con SweetAlert
     const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el usuario y no se podrá deshacer más tarde.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
 
    // Verificar la opción seleccionada por el usuario
    if (result.isConfirmed) {
      // Llamar al servicio para eliminar la publicación
      this.usuarioService.deleteUsuario(id)
        .subscribe(
          () => {
            console.log(`Publicación con ID ${id} eliminada correctamente`);
            // Recargar la página después de eliminar la publicación
            window.location.reload();
          },
          error => {
            console.error('Error al eliminar la publicación:', error);
          }
        );
    } else {
      // El usuario ha cancelado la acción
      console.log('La acción ha sido cancelada');
    }
  }

  mostrarFormularioModificar(): void {
    this.mostrandoFormularioModificar = true;
  }

  modificarUsuario() {
    if (this.usuario) {
      try {
        this.usuarioService.updateUsuario(this.usuario.id, this.usuario).toPromise();
        console.log("Usuario modificado exitosamente.");
        this.mostrandoFormularioModificar = false; // Ocultar el formulario después de modificar el usuario
        Swal.fire({
          icon: 'success',
          title: 'Modificación de usuario exitosa',
          text: '¡Usuario modificado correctamente!'
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡Modificación de usuario cancelada!'
        });
        console.error("Error al modificar el usuario:", error);
      }
    }
  }
  cancelarModificacion(): void {
    this.mostrandoFormularioModificar = false;
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: '¡Modificación de usuario cancelada!'
    });
}

async cerrarSesion() {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que quieres cerrar la sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });
    
    if (confirmacion.isConfirmed) {
      try {
        localStorage.removeItem('usuario');
        localStorage.setItem('tipoUsuario', 'noRegistrado');
        console.log('Sesión cerrada exitosamente');
        await Swal.fire({
          icon: 'success',
          title: 'Cierre de sesión exitoso',
          text: '¡Sesión cerrada correctamente!'
        });
        await this.router.navigateByUrl('/login');
        window.location.reload();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡Error al cerrar sesión!'
        });
      }
    } else {
      console.log('Cierre de sesión cancelado por el usuario');
    }
  }
}
