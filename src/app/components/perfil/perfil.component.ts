import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../model/usuario';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CompaniaService } from '../../services/compania.service';
import { Compania } from '../../model/compania';
import { AmistadService } from '../../services/amistad.service';
import { Amistad } from '../../model/amistad';
import { PublicacionService } from '../../services/publicacion.service';
import { Publicacion } from '../../model/publicacion';
import { Comentario } from '../../model/comentario';
import { ComentarioService } from '../../services/comentario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  @ViewChild('updateForm') updateForm!: NgForm; // Referencia al formulario
  @ViewChild('createForm') CreacionCompaniaForm!: NgForm; // Referencia al formulario

  constructor(private usuarioService: UsuarioService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private companiaService: CompaniaService,
    private amistadService: AmistadService,
    private publicacionService: PublicacionService,
    private comentarioService: ComentarioService) { }
  
  usuarioStorage!: Usuario;
  companias: Compania[] = [];
  usuarioId!: number;
  usuario!: Usuario;
  usuarioIdFromLocalStorage!: number;
  mostrandoFormularioModificar: boolean = false;
  mostrandoFormularioEliminar: boolean = false;
  mostrandoFormularioModificarPublicacion: boolean = false;
  showPassword: boolean = false;
  compania!: Compania;
  amistad!:Amistad;
  amistadId!: number;
  amistadesBySeguidor!: Amistad[];
  estaEnAmistad: boolean = false;
  usuarioSeguido!: Usuario[];
  usuarioSeguidor!: Usuario[];
  amistadElimnar!: number;
  usuarioTemporal!: Usuario;
  companiaTemporal!: Compania;
  indiceSeleccionado: number = -1;
  imagenesCompanias: string[] = [   // Rutas de las imágenes
    '../../../assets/perfiles/companias/imagenCompania1.png',
    '../../../assets/perfiles/companias/imagenCompania2.png',
    '../../../assets/perfiles/companias/imagenCompania3.png',
    '../../../assets/perfiles/companias/imagenCompania4.png',
    '../../../assets/perfiles/companias/imagenCompania5.png',
  ];
  imagenesUsuarios: string[] = [   // Rutas de las imágenes
  '../../../assets/perfiles/usuarios/imagenHombre1.png',
  '../../../assets/perfiles/usuarios/imagenMujer1.png',
  '../../../assets/perfiles/usuarios/imagenHombre2.png',
  '../../../assets/perfiles/usuarios/imagenMujer2.png',
  '../../../assets/perfiles/usuarios/imagenHombre3.png',
  '../../../assets/perfiles/usuarios/imagenMujer3.png',
];
  mostrarDialogo: boolean = false;
  publicacionesActual: Publicacion[] = [];
  publicacionesNoActual: Publicacion[] = [];
  publicacionTemporal!: Publicacion;
  publicacionEnEdicion: number | null = null;
  publicacionComentar: number | null = null;
  contenidoTemporal: string = '';
  isDadoMeGusta: boolean = false;
  publicacionesLiked: Set<number> = new Set();
  comentario!: Comentario;
  mostrarFormularioComentario: boolean = false;
  textoBotonComentario: string = 'Comentar';
  usuariosCargados: { [id: number]: Usuario } = {};

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.usuarioId = +params['id'];
      // Cargar el perfil del usuario utilizando el ID
      this.loadUsuarioById(this.usuarioId);     
      const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
  
        // Actualizar el idCreador después de obtenerlo del localStorage
        this.compania = {
          id: 0,
          nombre: "",
          descripcion: "",
          fotoPerfil: "",
          fechaCreacion: "",
          miembros: 1,
          idCreador: this.usuarioIdFromLocalStorage
        };

        // Llamar a loadCompaniasByIdCreador después de obtener usuarioIdFromLocalStorage
        this.loadCompaniaByIdCreador(this.usuarioIdFromLocalStorage);
        this.loadCompaniaById(this.usuarioIdFromLocalStorage);
        this.getAllpublicacionesActualByUsario(this.usuarioIdFromLocalStorage);
        this.getAllpublicacionesNoActualByUsario(this.usuarioId);

        this.amistad = {
          id:0,
          idSeguidor: 0,
          idSeguido: 0
        };

        this.comentario = {
          id:0,
          contenido:"",
          fechaComentario:"",
          idPublicacion:0,
          idUsuario:this.usuarioIdFromLocalStorage
        }
        this.getAmistadesBySeguidorySeguido(this.usuarioIdFromLocalStorage);
      }
    });
  }

  darMeGusta(publicacion: Publicacion) {
    // Verifica si el usuario ha dado "Me Gusta" a esta publicación
    const haDadoMeGusta = this.publicacionesLiked.has(publicacion.id);
  
    // Actualiza el contador de "Me Gusta" en la interfaz y la lista de "Me Gusta" del usuario
    if (haDadoMeGusta) {
      publicacion.numMeGustas--;
      this.publicacionesLiked.delete(publicacion.id);
    } else {
      publicacion.numMeGustas++;
      this.publicacionesLiked.add(publicacion.id);
    }
  
    // Llama al servicio para actualizar la publicación en la base de datos
    this.publicacionService.updatePublicacion(publicacion.id, publicacion).subscribe(() => {
    });
  }
  
  crearComentario(idPublicacion: number) {
    this.comentario.fechaComentario = new Date().toISOString();
    this.comentario.idPublicacion = idPublicacion;
  
    // Llamar al servicio para crear el comentario
    this.comentarioService.createComentario(this.comentario).subscribe(
      (id) => {
        console.log("Comentario creado correctamente con ID: " + id);
        // Cerrar el formulario de comentario y mostrar una alerta de éxito
        this.mostrarFormularioComentario = false;
        Swal.fire({
          icon: 'success',
          title: 'Comentario creado',
          text: 'El comentario ha sido creado correctamente.'
        });
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error("Error al crear el comentario:", error);
        // Mostrar una alerta de error si ocurre un problema al crear el comentario
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al crear el comentario. Por favor, inténtalo de nuevo.'
        });
      }
    );
  }

  mostrarCrearComentario(id: number){
    this.publicacionComentar = id;
    this.mostrarFormularioComentario = true;
  }
  
  cancelarComentario() {
    this.publicacionComentar = null;
  
    // Mostrar una alerta de cancelación
    Swal.fire({
        icon: 'info',
        title: 'Creación cancelada',
        text: 'Se ha cancelado la creación del comentario.'
    });
}

getAllpublicacionesActualByUsario(id: number) {
  this.publicacionService.getAllPublicacionesByUsuario(id).subscribe(
    publicaciones => {
      this.publicacionesActual = publicaciones.filter(publicacion => publicacion.idCompania == 0);
      this.publicacionesActual.forEach(publicacion => {
        this.loadComentariosForPublicacion(publicacion);
      });
    }
  );
}

getAllpublicacionesNoActualByUsario(id: number) {
  this.publicacionService.getAllPublicacionesByUsuario(id).subscribe(
    publicaciones => {
      this.publicacionesNoActual = publicaciones.filter(publicacion => publicacion.idCompania == 0);
      this.publicacionesNoActual.forEach(publicacion => {
        this.loadComentariosForPublicacion(publicacion);
      });
    }
  );
}

loadComentariosForPublicacion(publicacion: Publicacion) {
  const idPublicacion = publicacion.id;
  this.comentarioService.getComentariosByPublicacionId(idPublicacion).subscribe(
    comentarios => {
      publicacion.comentarios = comentarios;
      comentarios.forEach(comentario => {
        this.loadUsuarioById(comentario.idUsuario);
      });
    },
    error => {
      console.error(`Error al cargar comentarios para la publicación ${idPublicacion}:`, error);
    }
  );
}


  mostrarFormularioUpdatePublicacion(id: number, contenido: string) {
    this.publicacionEnEdicion = id;
    this.contenidoTemporal = contenido;
  }

  cancelarPublicacion() {
    this.publicacionEnEdicion = null;
    Swal.fire({
        icon: 'info',
        title: 'Modificación cancelada',
        text: 'Se ha cancelado la modificación de la publicación.',
        showConfirmButton: false,
        timer: 1500
    });
}

guardarPublicacion(id: number) {
    this.publicacionService.getPublicacionById(id).subscribe(
      publicacion => {
        this.publicacionTemporal = publicacion;
        this.publicacionTemporal.contenido = this.contenidoTemporal;
        this.publicacionService.updatePublicacion(id, this.publicacionTemporal).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Modificación exitosa',
              text: 'La publicación ha sido modificada correctamente.',
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigate(['/home']);
          },
          () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al modificar la publicación. Por favor, inténtalo de nuevo.',
              showConfirmButton: false,
              timer: 1500
            });
          }
        )
      }
    )
    this.publicacionEnEdicion = null;
}



eliminarPublicacion(id: number) {
  /*
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esto.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma la eliminación
      this.publicacionService.deletePublicacion(id).subscribe(
        () => {
          // Eliminar comentarios referenciados
          this.comentarioService.deleteComentariosByPublicacionId(id).subscribe(
            () => {
              // Si la eliminación es exitosa, mostrar un mensaje de éxito
              Swal.fire(
                'Eliminado!',
                'La publicación y sus comentarios han sido eliminados.',
                'success'
              );
              this.router.navigate(['/home']);
              // Aquí podrías realizar alguna acción adicional si es necesario
            },
            (error) => {
              // Si ocurre un error durante la eliminación de comentarios, mostrar un mensaje de error
              console.error('Error al eliminar los comentarios:', error);
              Swal.fire(
                'Error!',
                'No se pudieron eliminar los comentarios de la publicación.',
                'error'
              );
            }
          );
        },
        (error) => {
          // Si ocurre un error durante la eliminación, mostrar un mensaje de error
          console.error('Error al eliminar la publicación:', error);
          Swal.fire(
            'Error!',
            'No se pudo eliminar la publicación.',
            'error'
          );
        }
      );
    }
  });
  */
}

eliminarComentario(id: number) {
  this.comentarioService.deleteComentario(id).subscribe(
    () => {
      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Comentario eliminado',
        text: 'El comentario ha sido eliminado correctamente.'
      });
      this.router.navigate(['/home']);
    },
    error => {
      // Mostrar mensaje de error
      console.error('Error al eliminar el comentario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error al eliminar el comentario. Por favor, inténtalo de nuevo.'
      });
    }
  );
}

  

  elegirFotoPerfilCompania(indice: number) {
    this.companiaTemporal.fotoPerfil = this.imagenesCompanias[indice];
    this.cerrarDialogo();
  }

elegirFotoPerfil(indice: number) {
  this.indiceSeleccionado = indice;
  this.usuarioTemporal.fotoPerfil = this.imagenesUsuarios[indice];
  this.cerrarDialogo();
}


  mostrarIconos() {
    this.mostrarDialogo = true;
}

cerrarDialogo() {
    this.mostrarDialogo = false;
}

  goPerfil(usuarioId: number) {
    this.router.navigate(['/perfil', usuarioId]);
  }
  
  loadCompaniaByIdCreador(id:number){
    this.companiaService.getCompaniaByIdCreador(id).subscribe(
      (compania) => {
        this.compania = compania;
      },
      (error) => {
        // Manejar errores
        console.error('Este usuario no tiene compañia');
      }
    );
  }

  loadCompaniaById(id: number) {
    this.companiaService.getCompaniaById(id).subscribe(
      (compania) => {
        this.compania = compania;
        this.companiaTemporal = compania;
      },
      (error) => {
        // Manejar errores
        console.error('Error al cargar compañía por ID:', error);
      }
    );
  }
  
  goCompania(companiaID: number){
    this.router.navigate(['/compania', companiaID]);
  }
  
  togglePasswordVisibility() {
    if (!this.showPassword) {
      this.showPassword = true;
      const inputField = document.getElementById('contrasena') as HTMLInputElement;
      inputField.type = 'text';
    } else {
      this.showPassword = false;
      const inputField = document.getElementById('contrasena') as HTMLInputElement;
      inputField.type = 'password';
    }
  }

  loadUsuarioById(id: number) {
    this.usuarioService.getUsuarioById(id).subscribe(
      (usuario: Usuario) => {
        this.usuario = usuario;
        this.usuarioTemporal = usuario;
        this.usuariosCargados[id] = usuario;
        // Después de cargar el usuario, cargamos la compañía utilizando el atributo companiaSeguida
        if (usuario.companiaSeguida) {
          this.loadCompaniaById(usuario.companiaSeguida);
        } else {
          console.log('Este usuario no tiene compañía asociada');
        }
      },
      error => {
        console.error('Error al cargar perfil del usuario:', error);
      }
    );
  }


  crearCompania() {
    // Actualiza la fecha de creación de la compañía
    this.companiaTemporal.fechaCreacion = new Date().toISOString();
    
    // Llama al servicio para registrar la compañía
    this.companiaService.createCompania(this.companiaTemporal).subscribe(
      id => {
        console.log("Compañía con id: " + id + " creada correctamente");
        
        // Obtiene el usuario actual
        const usuarioLocalStorage = localStorage.getItem('usuario');
        if (usuarioLocalStorage) {
          const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
          const userId = usuarioAlmacenado.id;
          
          // Actualiza el atributo companiaSeguida del usuario con el ID de la nueva compañía
          this.usuarioService.updateCompaniaSeguida(userId, id).subscribe(
            () => {
              console.log('companiaSeguida actualizado correctamente');
            },
            error => {
              console.error('Error al actualizar companiaSeguida:', error);
            }
          );
        }
        
        // Navega a la página de inicio después de crear la compañía
        this.router.navigateByUrl('/home');
        
        // Muestra una notificación de éxito
        Swal.fire({
          icon: 'success',
          title: 'Registro de compañía exitoso',
        });
      },
      error => {
        // Muestra una notificación de error en caso de fallo
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Comprueba que los datos introducidos sean correctos'
        });
      }
    );
  
    // Oculta el formulario después de crear la compañía
    this.mostrandoFormularioEliminar = false;
  }
  
  

  async eliminarUsuario() {
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
      // Llamar al servicio para eliminar el usuario
      this.usuarioService.deleteUsuario(this.usuarioIdFromLocalStorage).subscribe(
        () => {
          localStorage.removeItem('usuario');
          localStorage.setItem('tipoUsuario', 'noRegistrado');
          // SweetAlert para eliminar correctamente
          Swal.fire({
            title: '¡Usuario eliminado!',
            text: 'El usuario ha sido eliminado correctamente.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then(() => {
            window.location.href = '/login';
          });
        },
        error => {
          // SweetAlert para error al eliminar
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al eliminar el usuario. Por favor, inténtalo de nuevo más tarde.',
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
          console.error('Error al eliminar el usuario:', error);
        }
      );
    } else {
      // El usuario ha cancelado la acción
      console.log('La acción ha sido cancelada');
    }
  }
  

  mostrarFormularioModificar(): void {
    this.mostrandoFormularioModificar = true;
    this.usuarioTemporal = { ...this.usuario };
  }

  mostrarFormularioEliminar(): void {
    this.mostrandoFormularioEliminar = true;
    this.companiaTemporal = { ...this.compania };
  }

  modificarUsuario() {
    // Lógica para modificar el usuario
    if (this.usuarioTemporal) {
      try {
        // Actualizar el usuario original con los datos del usuario temporal
        this.usuario = { ...this.usuarioTemporal };

        // Llamar al servicio para guardar los cambios
        this.usuarioService.updateUsuario(this.usuario.id, this.usuario).subscribe(
          () => {
            // Éxito al modificar el usuario
            Swal.fire({
              icon: 'success',
              title: 'Modificación exitosa',
              text: '¡El usuario ha sido modificado correctamente!'
            });
            this.mostrandoFormularioModificar = false;
          },
          error => {
            // Error al modificar el usuario
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: '¡No se pudo modificar el usuario!'
            });
            console.error('Error al modificar el usuario:', error);
          }
        );
      } catch (error) {
        console.error('Error al modificar el usuario:', error);
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

  cancelarCreacionCompania(): void {
    this.mostrandoFormularioEliminar = false;
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Creación de compania de usuario cancelada!'
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

seguirUsuario() {
  if (this.usuario) {
    this.amistad = {
      id:0,
      idSeguidor: this.usuarioIdFromLocalStorage,
      idSeguido: this.usuarioId
    };
    this.amistadService.createAmistad(this.amistad).subscribe(
      id => {
        console.log("amistad creada correctamente con ID: " + id);
        Swal.fire({
          icon: 'success',
          title: 'Seguimiento exitoso',
          text: '¡Ahora sigues a este usuario!'
        });
        this.router.navigateByUrl('/home');
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡No se pudo seguir a este usuario!'
        });
        console.error("Error al seguir al usuario:", error);
      }
    );
  }
}


  quitarLocalStorage(){
    localStorage.removeItem('usuario');
    localStorage.setItem('tipoUsuario', 'noRegistrado');
    console.log('Sesión cerrada exitosamente');
    this.router.navigateByUrl('/login');
    window.location.reload();
  }


  getAmistadesBySeguidorySeguido(id: number) {
    this.amistadService.findBySeguidor(id).subscribe(
      (amistades) => {
        this.amistadesBySeguidor = amistades;
  
        if (this.amistadesBySeguidor.some(amistad => 
            amistad.idSeguido === this.usuarioId)) {
          this.estaEnAmistad = true;
        } else {
          this.estaEnAmistad = false;
        }
        
        this.usuarioSeguido = [];
        let userIds = new Set<number>(); // Conjunto para almacenar los IDs de los usuarios ya agregados
  
        this.amistadService.getAllAmistades().subscribe(
          amistades =>{
            this.amistadesBySeguidor = amistades;
            for (let i = 0; i <  this.amistadesBySeguidor.length; i++) {
              if (!userIds.has(this.amistadesBySeguidor[i].idSeguido) && this.amistadesBySeguidor[i].idSeguido !== this.usuarioId && this.amistadesBySeguidor[i].idSeguidor == this.usuarioId) {
                this.usuarioService.getUsuarioById(this.amistadesBySeguidor[i].idSeguido).subscribe(
                    seguido => {
                        this.usuarioSeguido.push(seguido);
                    });
                userIds.add(this.amistadesBySeguidor[i].idSeguido);
              }
            }
          })
      });
  }
  

  dejarDeSeguirUsuario(id: number) {
    this.amistadService.getAllAmistades().subscribe(
      amistades =>{
        for (let i = 0; i < amistades.length; i++) {
          if(amistades[i].idSeguido == id){
            this.amistadElimnar = amistades[i].id;
          }
        }
      }
    )
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres dejar de seguir a este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, dejar de seguir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.amistadService.deleteAmistad(this.amistadElimnar).subscribe(
          id => {
            Swal.fire({
              icon: 'success',
              title: 'Amistad eliminada',
              text: '¡Amistad eliminada Correctamente!'
            });
            this.router.navigateByUrl('/home');
            // Aquí puedes agregar lógica adicional después de eliminar la amistad
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: '¡No se pudo eliminar la amistad!'
            });
          }
        );
      }
    });
  }
  


}