import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';
import { Compania } from '../../model/compania';
import { Publicacion } from '../../model/publicacion';
import { CompaniaService } from '../../services/compania.service';
import { PublicacionService } from '../../services/publicacion.service';
import { ButtonModule } from 'primeng/button';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificacionService } from '../../services/notificacion.service';
import { Notificacion } from '../../model/notificacion';

@Component({
  selector: 'app-moderar',
  standalone: true,
  imports: [CommonModule, ButtonModule, LoaderComponent],
  templateUrl: './moderar.component.html',
  styleUrl: './moderar.component.scss'
})
export class ModerarComponent implements OnInit{

  loader: boolean = false;
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  companias: Compania[] = [];
  companiasFiltradas: Compania[] = [];
  publicaciones: Publicacion[] = [];
  notificacion!: Notificacion;
  usuarioIdFromLocalStorage!: number;

  constructor (private usuarioService: UsuarioService,
    private companiaService: CompaniaService,
    private publicacionService: PublicacionService,
    private notificacionService: NotificacionService,
    private router: Router, 
  ){}

  ngOnInit(): void {
    const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
        this.notificacion = {
          id:0,
          contenido: "",
          tipoNotificacion: "",
          fechaNotificacion: "",
          idUsuarioEmisor: this.usuarioIdFromLocalStorage,
          idUsuarioRemitente: 0
        }
      }
    this.loadUsuarios();
    this.loadCompanias();
    this.loadPublicaciones();
    
    setTimeout(() => {
      this.loader = true;
  }, 1500);
  }

  loadUsuarios() {
    this.usuarioService.getAllUsuarios().subscribe(
      usuarios => {
        this.usuarios = usuarios.filter(usuario => usuario.tipoUsuario !== 'admin');
        this.usuariosFiltrados = [...this.usuarios];
      },
      error => {
        console.error('Error al cargar los usuarios', error);
      }
    );
  }

  enviarNotiUsuario(id: number) {
    this.notificacion.fechaNotificacion = new Date().toISOString();
    this.notificacion.idUsuarioRemitente = id;
    this.notificacion.tipoNotificacion = "advertenciaUsuario";
    this.notificacionService.createNotificacion(this.notificacion).subscribe(
      () => {
        Swal.fire(
          '¡Notificación enviada!',
          'La notificación se ha enviado correctamente.',
          'success'
        );
        this.router.navigateByUrl('/home');
      },
      error => {
        Swal.fire(
          '¡Error!',
          'Ocurrió un error al enviar la notificación. Por favor, inténtalo de nuevo más tarde.',
          'error'
        );
      }
    )
  }

  eliminarUsuario(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario(id).subscribe(
          () => {
            Swal.fire(
              '¡Eliminado!',
              'El usuario ha sido eliminado correctamente.',
              'success'
            );
            this.router.navigateByUrl('/home');
          },
          error => {
            Swal.fire(
              '¡Error!',
              'Ocurrió un error al eliminar el usuario. Por favor, inténtalo de nuevo más tarde.',
              'error'
            );
          }
        );
      }
    });
  }


  irAlPerfilUsuario(id: number){
    this.router.navigate(['/perfil', id]);
  }
  

  loadCompanias(){
    this.companiaService.getAllCompanias().subscribe(
      companias => {
        this.companias = companias;
        this.companiasFiltradas = [...this.companias];
      }
    )
  }

  irAlPerfilCompania(id: number){
    this.router.navigate(['/compania', id]);
  }

  enviarNotiCompania(idCreador: number) {
    this.notificacion.fechaNotificacion = new Date().toISOString();
    this.notificacion.idUsuarioRemitente = idCreador;
    this.notificacion.tipoNotificacion = "advertenciaCompania";
    this.notificacionService.createNotificacion(this.notificacion).subscribe(
      () => {
        Swal.fire(
          '¡Notificación enviada!',
          'La notificación se ha enviado correctamente.',
          'success'
        );
        this.router.navigateByUrl('/home');
      },
      error => {
        Swal.fire(
          '¡Error!',
          'Ocurrió un error al enviar la notificación. Por favor, inténtalo de nuevo más tarde.',
          'error'
        );
      }
    )
  }

  eliminarCompania(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.companiaService.deleteCompania(id).subscribe(
          () => {
            Swal.fire(
              '¡Eliminada!',
              'La compañía ha sido eliminada correctamente.',
              'success'
            );
            this.loadCompanias(); // Recargar las compañías después de eliminar una
          },
          error => {
            Swal.fire(
              '¡Error!',
              'Ocurrió un error al eliminar la compañía. Por favor, inténtalo de nuevo más tarde.',
              'error'
            );
          }
        );
      }
    });
  }

  loadPublicaciones(){
    this.publicacionService.getAllPublicaciones().subscribe(
      publicaciones => {
      this.publicaciones = publicaciones;
      }
    )
  }

  enviarNotiPublicacion(idCreador: number) {
    this.notificacion.fechaNotificacion = new Date().toISOString();
    this.notificacion.idUsuarioRemitente = idCreador;
    this.notificacion.tipoNotificacion = "advertenciaPublicacion";
    this.notificacionService.createNotificacion(this.notificacion).subscribe(
      () => {
        Swal.fire(
          '¡Notificación enviada!',
          'La notificación se ha enviado correctamente.',
          'success'
        );
        this.router.navigateByUrl('/home');
      },
      error => {
        Swal.fire(
          '¡Error!',
          'Ocurrió un error al enviar la notificación. Por favor, inténtalo de nuevo más tarde.',
          'error'
        );
      }
    )
  }

  truncateContent(content: string): string {
    const maxLength = 25; // Define el número máximo de caracteres
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...'; // Agrega tres puntos si el contenido es más largo que el máximo
    } else {
      return content; // Devuelve el contenido sin cambios si es menor o igual al máximo
    }
  }
  
  

  eliminarPublicacion(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicacionService.deletePublicacion(id).subscribe(
          () => {
            Swal.fire(
              '¡Eliminada!',
              'La publicación ha sido eliminada correctamente.',
              'success'
            );
            this.loadPublicaciones(); // Recargar las publicaciones después de eliminar una
          },
          error => {
            Swal.fire(
              '¡Error!',
              'Ocurrió un error al eliminar la publicación. Por favor, inténtalo de nuevo más tarde.',
              'error'
            );
          }
        );
      }
    });
  }
  

  filtrarUsuarios(event: any) {
    const texto = (event.target as HTMLInputElement).value.trim();
    this.usuariosFiltrados = this.usuarios.filter(
      usuario =>
        usuario.nombre.toUpperCase().startsWith(texto.toUpperCase())
    );
  }

  filtrarCompanias(event: any) {
    const texto = (event.target as HTMLInputElement).value.trim();
    this.companiasFiltradas = this.companias.filter(
      compania =>
        compania.nombre.toUpperCase().startsWith(texto.toUpperCase())
    );
  }
  

  trackByIdUsuario(index: number, usuario: Usuario): number {
    return usuario.id;
  }

  trackByIdCompania(index: number, compania: Compania): number {
    return compania.id;
  }

  trackByIdPublicacion(index: number, publicacion: Publicacion): number {
    return publicacion.id;
  }

}
