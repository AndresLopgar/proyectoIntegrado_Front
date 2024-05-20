import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { PublicacionService } from '../../services/publicacion.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Publicacion } from '../../model/publicacion';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { CompaniaService } from '../../services/compania.service';
import { Compania } from '../../model/compania';
import { ComentarioService } from '../../services/comentario.service';
import { Comentario } from '../../model/comentario';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, RouterLink],
  providers:[UsuarioService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('publicacionForm') publicacionForm!: NgForm; // Referencia al formulario
  usuarios: Usuario[] = [];
  publicaciones: Publicacion[] = [];
  usuarioIdFromLocalStorage!: number;
  noHayUsuarioIniciado: boolean = false;
  usuariosCargados: { [id: number]: Usuario } = [];
  publicacion: Publicacion = {
    id: 0,
    contenido: "",
    fechaPublicacion: "",
    meGusta: false,
    numMeGustas: 0,
    idUsuario: 0,
    idCompania: 0,
    comentarios: []
  };

  mostrarCrear: boolean = false;
  companiasCargadas: { [id: number]: Compania } = {};
  publicacionesLiked: Set<number> = new Set();
  publicacionComentar: number | null = null; // ID de la publicación para la cual se está creando un comentario
  comentario: Comentario = {
    id: 0,
    contenido: "",
    fechaComentario: "",
    idUsuario: 0,
    idPublicacion: 0
  };
  textoBotonComentario: string = "Comentar"; // Texto dinámico para el botón de comentario

  constructor(private usuarioService: UsuarioService, 
    private publicacionService: PublicacionService,
    private companiaService: CompaniaService,
    private comentarioService: ComentarioService, 
    private router: Router) { 
    const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
        this.noHayUsuarioIniciado = true;
      } else {
        this.noHayUsuarioIniciado = false;
      }
  }

  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe(
      data => {
        this.usuarios = data;
      },
      error => {
        console.log('Error al recuperar usuarios:', error);
      }
    );

    this.publicacionService.getAllPublicaciones().subscribe(
      publicaciones => {
        this.publicaciones = publicaciones;
        this.publicaciones.forEach(publicacion => {
          if (publicacion.idCompania !== null) {
            this.loadCompaniaById(publicacion.idCompania);
          }
          this.loadUsuarioById(publicacion.idUsuario);
          this.loadComentariosForPublicacion(publicacion); // Cargar comentarios para esta publicación
        });
      },
      error => {
        console.error('Error al cargar las publicaciones:', error);
      }
    );
  
  }

  eliminarComentario(publicacion: Publicacion, comentario: Comentario, comentarioIdUsuario: number) {
    // Verificar si el usuario que inició sesión es el mismo que hizo el comentario
    if (this.usuarioIdFromLocalStorage === comentarioIdUsuario) {
      // Lógica para eliminar el comentario
      this.comentarioService.deleteComentario(comentario.id).subscribe(
        () => {
          // Eliminar el comentario del arreglo de comentarios de la publicación
          publicacion.comentarios = publicacion.comentarios.filter(c => c.id !== comentario.id);
          // Mostrar un mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: 'Comentario eliminado',
            text: 'El comentario ha sido eliminado correctamente.'
          });
        },
        error => {
          console.error('Error al eliminar el comentario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al eliminar el comentario. Por favor, inténtalo de nuevo.'
          });
        }
      );
    } else {
      // Si el usuario no coincide, mostrar un mensaje de error
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No tienes permiso para eliminar este comentario.'
      });
    }
  }
  

  loadCompaniaById(idCompania: number) {
    this.companiaService.getCompaniaById(idCompania).subscribe(
      (compania: Compania) => {
        this.companiasCargadas[idCompania] = compania;
      },
      (error) => {
        console.error('Error al cargar compañía por ID:', error);
      }
    );
  }

  loadComentariosForPublicacion(publicacion: Publicacion) {
    const idPublicacion = publicacion.id;
    this.comentarioService.getComentariosByPublicacionId(idPublicacion).subscribe(
      comentarios => {
        publicacion.comentarios = comentarios;
        publicacion.comentarios.forEach(comentario => {
          // Verificar si el usuario asociado al comentario ya está cargado
          if (!this.usuariosCargados[comentario.idUsuario]) {
            // Si no está cargado, cargarlo y agregarlo a usuariosCargados
            this.usuarioService.getUsuarioById(comentario.idUsuario).subscribe(
              usuario=> {
                this.usuariosCargados[comentario.idUsuario] = usuario;
              }
            )
          }
        });
      },
      error => {
        console.error(`Error al cargar comentarios para la publicación ${idPublicacion}:`, error);
      }
    );
  }
  
  

  irAlPerfilUsuario(idUsuario: number) {
    // Navegar al perfil del usuario
    this.router.navigate(['/perfil', idUsuario]);
  }
  

  irAlLogin(){
    this.router.navigate(['/login']);
  }

  irAlPerfilCompania(idCompania: number) {
  this.router.navigate(['/compania', idCompania]);
  }

  loadUsuarioById(id: number) {
    // Verificar si el usuario ya está cargado
    if (!this.usuariosCargados[id]) {
      // Si no está cargado, cargarlo y agregarlo a usuariosCargados
      this.usuarioService.getUsuarioById(id).subscribe(
        (usuario: Usuario) => {
          this.usuariosCargados[id] = usuario;
        },
        error => {
          console.error('Error al cargar perfil del usuario:', error);
        }
      );
    }
  }

  mostrarCrearPublicacion(){
    this.mostrarCrear = true;
  }

  cerrarCrearPublicacion() {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Has cancelado la creación de la publicación.',
      showConfirmButton: false,
      timer: 1500 
    });
    this.mostrarCrear = false;
  }
  

  crearPublicacionUsuario() {
    this.publicacion.fechaPublicacion = new Date().toISOString();
    this.publicacion.idUsuario = this.usuarioIdFromLocalStorage;
  
    this.publicacionService.createPublicacion(this.publicacion).subscribe(
      id => {
        this.publicacion.id = id;
        Swal.fire(
          'Publicación creada',
          'La publicación se ha creado correctamente.',
          'success'
        );
        this.publicacionForm.resetForm();
        this.mostrarCrear = false;
        this.router.navigate(['/perfil',  this.usuarioIdFromLocalStorage]);
      },
      error => {
        Swal.fire(
          'Error',
          'Ha ocurrido un error al crear la publicación. Por favor, inténtalo de nuevo más tarde.',
          'error'
        );
      }
    );
  } 

  darMeGusta(publicacion: Publicacion) {
    if (this.publicacionesLiked.has(publicacion.id)) {
      publicacion.numMeGustas--;
      this.publicacionesLiked.delete(publicacion.id); 
    } else {
      publicacion.numMeGustas++;
      this.publicacionesLiked.add(publicacion.id); 
    }
    this.publicacionService.updatePublicacion(publicacion.id, publicacion).subscribe(() => {
    });
  }
  
  crearComentario(publicacion: Publicacion, contenido: string) {
    const nuevoComentario: Comentario = {
      id: 0,
      contenido: contenido,
      fechaComentario: new Date().toISOString(),
      idUsuario: this.usuarioIdFromLocalStorage,
      idPublicacion: publicacion.id
    };
  
    this.comentarioService.createComentario(nuevoComentario).subscribe(
      id => {
        nuevoComentario.id = id;
        publicacion.comentarios.push(nuevoComentario);
        Swal.fire({
          icon: 'success',
          title: 'Comentario creado',
          text: 'El comentario ha sido creado correctamente.'
        });
        this.publicacionComentar = null;
        this.router.navigate(['/perfil' + this.usuarioIdFromLocalStorage]);
      },
      error => {
        console.error('Error al crear el comentario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al crear el comentario. Por favor, inténtalo de nuevo.'
        });
      }
    );
  }
  

  mostrarCrearComentario(idPublicacion: number) {
    this.publicacionComentar = idPublicacion;
    this.textoBotonComentario = "Comentar"; // Restaurar texto del botón a su estado original
  }

  cancelarComentario() {
    this.publicacionComentar = null;
    this.comentario.contenido = "";
  }
}
