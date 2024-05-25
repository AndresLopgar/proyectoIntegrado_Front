import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Compania } from '../../model/compania';
import { CompaniaService } from '../../services/compania.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import * as XLSX from 'xlsx';
import { Publicacion } from '../../model/publicacion';
import { PublicacionService } from '../../services/publicacion.service';
import { ComentarioService } from '../../services/comentario.service';
import { Comentario } from '../../model/comentario';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { Notificacion } from '../../model/notificacion';
import { NotificacionService } from '../../services/notificacion.service';


@Component({
  selector: 'app-compania',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, LoaderComponent],
  templateUrl: './compania.component.html',
  styleUrl: './compania.component.scss'
})
export class CompaniaComponent  implements OnInit{
  @ViewChild('upadteForm') CreacionCompaniaForm!: NgForm; // Referencia al formulario
  compania!: Compania;
  companiaId!: number;
  usuarioId!: number;
  usuarios: Usuario[] = [];
  usuariosSeguidores: Usuario[] =[];
  mostrandoFormularioModificar: boolean = false;
  mostrandoFormularioCrearPublicacion: boolean = false;
  usuarioLocalStorage: any;
  usuarioActual!: Usuario;
  tieneCompania: number = 0;
  mostrarDialogo: boolean = false;
  companiaTemporal!: Compania;
  imagenesCompanias: string[] = [   // Rutas de las imágenes
    '../../../assets/perfiles/companias/imagenCompania1.png',
    '../../../assets/perfiles/companias/imagenCompania2.png',
    '../../../assets/perfiles/companias/imagenCompania3.png',
    '../../../assets/perfiles/companias/imagenCompania4.png',
    '../../../assets/perfiles/companias/imagenCompania5.png',
  ];
  publicacion!: Publicacion;
  publicacionesActual: Publicacion[] = [];
  publicacionesNoActual: Publicacion[] = [];
  mostrandoFormularioModificarPublicacion: boolean = false;
  publicacionTemporal!: Publicacion;
  contenidoTemporal: string = '';
  publicacionEnEdicion: number | null = null;
  usuarioIdFromLocalStorage!: number;
  comentario !: Comentario;
  mostrarFormularioComentario: boolean = false;
  publicacionComentar: number | null = null;
  usuariosCargados: { [id: number]: Usuario } = {};
  publicacionesLiked: Set<number> = new Set();
  loader: boolean = false;
  notificacion!: Notificacion;

  constructor(private companiaService: CompaniaService, 
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private comentarioService: ComentarioService,
    private notificacionService: NotificacionService){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.companiaId = +params['id'];
      
      
      const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
        this.usuarioId = usuarioAlmacenado.id;
        this.loadUsuarioById(this.usuarioId);
        this.publicacion = {
          id: 0,
          contenido: "",
          fechaPublicacion: "",
          meGusta: false,
          numMeGustas: 0,
          idUsuario: this.usuarioId,
          idCompania: this.companiaId,
          comentarios: []
        };
        this.comentario = {
          id:0,
          contenido:"",
          fechaComentario:"",
          idPublicacion:0,
          idUsuario:this.usuarioIdFromLocalStorage
        }
        this.notificacion = {
          id:0,
          contenido: "",
          tipoNotificacion: "",
          fechaNotificacion: "",
          idUsuarioEmisor: this.usuarioIdFromLocalStorage,
          idUsuarioRemitente: 0
        }
        this.loadCompania();
        this.getAllUsuarios();
        this.getAllPublicacionesActuales(this.companiaId);
        this.getAllPublicacionesNoActuales(this.companiaId);
      }
    });

    setTimeout(() => {
      this.loader = true;
  }, 1500);
  }

  elegirFotoPerfilCompania(indice: number) {
    this.companiaTemporal.fotoPerfil = this.imagenesCompanias[indice];
    this.cerrarDialogo();
  }

  mostrarIconos() {
    this.mostrarDialogo = true;
    console.log(this.mostrarDialogo);
}
  cerrarDialogo() {
    this.mostrarDialogo = false;
}

  loadCompania(){
    this.companiaService.getCompaniaById(this.companiaId).subscribe(
      (compania) => {
        this.compania = compania;
        this.companiaTemporal = compania;
        this.usuariosSeguidores = this.usuarios.filter(usuario => usuario.companiaSeguida === this.companiaId);
      },
      (error) => {
        console.error('Error al cargar la compañía:', error);
      })
  }

  getAllUsuarios() {
    this.usuarioService.getAllUsuarios().subscribe(
      usuarios => {
        this.usuarios = usuarios;
        this.moveCreatorToTop();
        this.loadCompania();
      },
      error => {
        console.log('Error al recuperar usuarios:', error);
      }
    );
  }
  

  moveCreatorToTop() {
    const creatorIndex = this.usuarios.findIndex(usuario => usuario.id === this.compania.idCreador);
    if (creatorIndex !== -1) {
      const creator = this.usuarios.splice(creatorIndex, 1)[0];
      this.usuarios.unshift(creator);
    }
  }

  goPerfil(usuarioId: number) {
    this.router.navigate(['/perfil', usuarioId]); // Suponiendo que la ruta para el perfil sea '/perfil'
  }
  
  loadUsuarioById(id: number) {
    this.usuarioService.getUsuarioById(id).subscribe(
      (usuario: Usuario) => {
        this.usuarioActual = usuario;
      },
      error => {
        console.error('Error al cargar perfil del usuario:', error);
      }
    );
  } 

  async eliminarUsuarioCompania(id: number) {
    const result = await Swal.fire({
      title: '¿Estás seguro de que deseas abandonar esta compañía?',
      text: 'Esta acción eliminará tu membresía en la compañía.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, abandonar',
      cancelButtonText: 'Cancelar'
    });
  
    if (result.isConfirmed) {
        try {
          // Actualizar el atributo companiaSeguida del usuario a 0
          await this.usuarioService.updateCompaniaSeguida(id, 0).toPromise();
          console.log('companiaSeguida actualizado a 0 correctamente');
          
          // Obtener el valor actual del atributo miembros de la compañía
          const compania = await this.companiaService.getCompaniaById(this.companiaId).toPromise();
          if (compania) {
            const nuevosMiembros = compania.miembros - 1;
            // Actualizar el atributo miembros de la compañía
            await this.companiaService.updateMiembrosCompania(this.companiaId, nuevosMiembros).toPromise();
            console.log('Atributo miembros decrementado correctamente.');
  
            await Swal.fire({
              icon: 'success',
              title: 'Usuario eliminado de la compañía exitoso',
              text: 'Has eliminado al usuario de la compañía correctamente.'
            });
            
          } else {
            console.error('No se pudo obtener la compañía.');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener la compañía.'
            });
          }
        } catch (error) {
          console.error('Error al eliminar al usuario de la compañía:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Error al eliminar al usuario la compañía!'
          });
        }
      } else {
        console.error('No se pudo obtener el usuario actual.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el usuario actual.'
        });
      }
  }
  
  
  

  async eliminarCompania(id: number) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la compañía y no se podrá deshacer más tarde.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (result.isConfirmed) {
      try {
        await this.companiaService.deleteCompania(id).toPromise();
        console.log(`Compañía con ID ${id} eliminada correctamente`);
  
        // Obtener el usuario actual
        const usuarioLocalStorage = localStorage.getItem('usuario');
        if (usuarioLocalStorage) {
          const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
          const userId = usuarioAlmacenado.id;
  
          // Actualizar el atributo companiaSeguida del usuario a cero
          await this.usuarioService.updateCompaniaSeguida(userId, 0).toPromise();
          console.log('companiaSeguida actualizado correctamente');
        }
  
        await this.router.navigateByUrl('/'); // Redirigir a la página principal o a donde desees
        Swal.fire({
          icon: 'success',
          title: 'Eliminación de compañía exitosa',
          text: '¡Compañía eliminada correctamente!'
        });
      } catch (error) {
        console.error('Error al eliminar la compañía:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡Error al eliminar la compañía!'
        });
      }
    } else {
      console.log('La acción ha sido cancelada');
    }
  }
  
  

  async modificarCompania() {
    if (this.companiaTemporal) {
      try {
        this.compania = { ...this.companiaTemporal };
  
        await this.companiaService.updateCompania(this.compania.id, this.compania).toPromise();
        console.log('Compañía modificada exitosamente.');
  
        // Éxito al modificar la compañía
        Swal.fire({
          icon: 'success',
          title: 'Modificación de compañía exitosa',
          text: '¡Compañía modificada correctamente!'
        }).then(() => {
          // Ocultar el formulario de modificación
          this.mostrandoFormularioModificar = false;
  
          // Recargar la compañía después de la modificación
          this.loadCompania();
        });
      } catch (error) {
        // Error al modificar la compañía
        console.error('Error al modificar la compañía:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡Error al modificar la compañía!'
        });
      }
    }
  }

  crearPublicacionCompania() {
    this.publicacion.fechaPublicacion = new Date().toISOString();
    this.publicacion.idCompania = this.companiaId;
    
    this.publicacionService.createPublicacion(this.publicacion).subscribe(
      () => {
        // Alerta de éxito si la publicación se crea correctamente
        Swal.fire({
          icon: 'success',
          title: 'Publicación creada correctamente',
          showConfirmButton: false,
          timer: 1500
        });
            // Iterar sobre todos los usuarios para buscar coincidencias
            for (const usuario of this.usuariosSeguidores) {
              if (usuario.id !== this.compania.idCreador) {
                // Crear una nueva instancia de Notificacion para cada usuario coincidente
                const notificacion: Notificacion = {
                  id: 0,
                  contenido: "",
                  idUsuarioEmisor: this.usuarioIdFromLocalStorage,
                  fechaNotificacion: new Date().toISOString(),
                  idUsuarioRemitente: usuario.id,
                  tipoNotificacion: "publicacionCompania"
                };
  
                // Crear la notificación
                this.notificacionService.createNotificacion(notificacion).subscribe(
                  () => {
                    this.router.navigate(['/perfil', this.usuarioIdFromLocalStorage]);
                  },
                  error => {
                    console.error('Error al crear la notificación:', error);
                  }
                );
                break; 
              }
            }
      }
    );
  }
  
            

getAllPublicacionesActuales(idCompania: number) {
  this.publicacionService.getAllPublicacionesByCompania(this.companiaId).subscribe(
    publicaciones => {
      this.companiaService.getCompaniaById(idCompania).subscribe(
        compania => {
          this.publicacionesActual = publicaciones.filter(publicacion => compania.idCreador == this.compania.idCreador);
          this.publicacionesActual.forEach(publicacion => {
            this.loadComentariosForPublicacion(publicacion);
          });
        }
      );
    }
  );
}

getAllPublicacionesNoActuales(idCompania: number) {
  this.publicacionService.getAllPublicacionesByCompania(this.companiaId).subscribe(
    publicaciones => {
      this.companiaService.getCompaniaById(idCompania).subscribe(
        compania => {
          this.publicacionesNoActual = publicaciones.filter(publicacion => compania.idCreador != this.compania.idCreador);
          this.publicacionesNoActual.forEach(publicacion => {
            this.loadComentariosForPublicacion(publicacion);
          });
        }
      );
    }
  );
}


irAlPerfilUsuario(idUsuario: number) {
  // Navegar al perfil del usuario
  this.router.navigate(['/perfil', idUsuario]);
}

  mostrarCrearPublicacion(){
    this.mostrandoFormularioCrearPublicacion = true;
  }

  cerrarCrearPublicacion(){
    this.mostrandoFormularioCrearPublicacion = false;
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
  // Mostrar SweetAlert para confirmar la eliminación
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
          // Si la eliminación es exitosa, mostrar un mensaje de éxito
          Swal.fire(
            'Eliminado!',
            'La publicación ha sido eliminada.',
            'success'
          );
          this.router.navigate(['/perfil', this.usuarioIdFromLocalStorage]);
          // Aquí podrías realizar alguna acción adicional si es necesario
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
}

  mostrarFormularioModificar(): void {
    this.mostrandoFormularioModificar = true;
    this.companiaTemporal = { ...this.compania };
  }

  cancelarModificacion(): void {
    this.mostrandoFormularioModificar = false;
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: '¡Modificación de usuario cancelada!'
    });
  }

  abandonarCompania(idCompania: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres abandonar esta compañía?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, abandonar',
      cancelButtonText: 'cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Obtener el usuario actual
        const usuarioLocalStorage = localStorage.getItem('usuario');
        if (usuarioLocalStorage) {
          const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
          const userId = usuarioAlmacenado.id;

          // Actualizar el atributo companiaSeguida del usuario a 0
          this.usuarioService.updateCompaniaSeguida(userId, 0).subscribe(
            () => {
              console.log('companiaSeguida actualizado a 0 correctamente');
              this.notificacion.fechaNotificacion = new Date().toISOString();
              this.notificacion.idUsuarioRemitente = this.compania.idCreador;
              this.notificacion.tipoNotificacion = "dejaCompania";
              this.notificacionService.createNotificacion(this.notificacion).subscribe(
              ()=> {
              }
            )
              
              // Obtener el valor actual del atributo miembros de la compañía
              this.companiaService.getCompaniaById(idCompania).subscribe(
                (compania: Compania) => {
                  const nuevosMiembros = compania.miembros - 1;
                  // Actualizar el atributo miembros de la compañía
                  this.companiaService.updateMiembrosCompania(idCompania, nuevosMiembros).subscribe(
                    () => {
                      console.log('Atributo miembros decrementado correctamente.');
                      this.router.navigateByUrl('/home');
                    },
                    error => {
                      console.error('Error al decrementar el atributo miembros:', error);
                    }
                  );
                },
                error => {
                  console.error('Error al obtener la compañía:', error);
                }
              );
            },
            error => {
              console.error('Error al actualizar companiaSeguida:', error);
            }
          );
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Se ha abandonado la compañía correctamente.',
            confirmButtonText: 'Entendido'
          }).then((result) => {
            if (result.isConfirmed) {
            }
          });
          this.router.navigateByUrl('/home');
        }
      }
    });
  }
  
  async entrarCompania(idCompania: number) {
    // Obtener el usuario actual
    const usuarioLocalStorage = localStorage.getItem('usuario');
    if (usuarioLocalStorage) {
      const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
      const userId = usuarioAlmacenado.id;
      
      try {
        // Actualizar el atributo companiaSeguida del usuario
        await this.usuarioService.updateCompaniaSeguida(userId, idCompania).toPromise();
        console.log('companiaSeguida actualizado correctamente');
        
        // Obtener el valor actual del atributo miembros de la compañía
        const compania = await this.companiaService.getCompaniaById(idCompania).toPromise();
        if (compania) {
          const nuevosMiembros = compania.miembros + 1;
          // Actualizar el atributo miembros de la compañía
          await this.companiaService.updateMiembrosCompania(idCompania, nuevosMiembros).toPromise();
          console.log('Atributo miembros incrementado correctamente.');
  
          // Mostrar Sweet Alert de éxito
          await Swal.fire({
            icon: 'success',
            title: 'Entrada a compañía exitosa',
            text: 'Has ingresado a la compañía correctamente.'
          });
          this.notificacion.fechaNotificacion = new Date().toISOString();
          this.notificacion.idUsuarioRemitente = this.compania.idCreador;
          this.notificacion.tipoNotificacion = "unirseCompania";
          this.notificacionService.createNotificacion(this.notificacion).subscribe(
          ()=> {
          }
        )
  
          // Redirigir a la página de inicio
          this.router.navigateByUrl('/home');
        } else {
          console.error('No se pudo obtener la compañía.');
          // Mostrar Sweet Alert de error
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la información de la compañía.'
          });
        }
      } catch (error) {
        console.error('Error al entrar a la compañía:', error);
        // Mostrar Sweet Alert de error
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡Error al ingresar a la compañía!'
        });
      }
    } else {
      // Redirigir al usuario a la página de inicio si no se puede obtener el usuario actual
      this.router.navigateByUrl('/home');
    }
  }
  
  
  async generaInforme() {
    // Filtrar los usuarios cuyo atributo companiaSeguida sea igual al ID de la compañía
    const usuariosFiltrados = this.usuarios.filter(usuario => usuario.companiaSeguida === this.companiaId);
  
    // Crear un nuevo arreglo solo con los datos necesarios
    const data = usuariosFiltrados.map(usuario => ({
      Nombre: usuario.nombre,
      Edad: usuario.edad,
      Profesion: usuario.profesion
    }));
  
    // Crear un nuevo libro de Excel
    const wb = XLSX.utils.book_new();
    
    // Crear una nueva hoja en el libro de Excel
    const ws = XLSX.utils.json_to_sheet(data);
  
    // Asignar nombres a las columnas
    ws['!cols'] = [
      { wch: 20 }, // Tamaño de la columna para el nombre
      { wch: 10 }, // Tamaño de la columna para la edad
      { wch: 20 }, // Tamaño de la columna para la profesión
    ];
    ws['A1'] = { v: 'Nombre', t: 's' };
    ws['B1'] = { v: 'Edad', t: 's' };
    ws['C1'] = { v: 'Profesion', t: 's' };
  
    // Agregar la hoja al libro de Excel
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
  
    // Convertir el libro de Excel a un archivo binario
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    // Crear un Blob a partir del archivo binario
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
  
    // Crear una URL para el Blob
    const blobUrl = URL.createObjectURL(blob);
  
    // Crear un enlace de descarga y hacer clic en él para descargar el archivo
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'informe_usuarios.xlsx';
    a.click();
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
        this.notificacion.fechaNotificacion = new Date().toISOString();
        this.notificacion.idUsuarioRemitente = this.compania.idCreador;
        this.notificacion.tipoNotificacion = "comentaCompania";
        this.notificacionService.createNotificacion(this.notificacion).subscribe(
          ()=> {
          }
        )
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

  mostrarCrearComentario(id: number){
    this.publicacionComentar = id;
    this.mostrarFormularioComentario = true;
    
  }

  cancelarComentario() {
    this.publicacionComentar = null;
    this.comentario.contenido = '';

    // Mostrar una alerta de cancelación
    Swal.fire({
        icon: 'info',
        title: 'Creación cancelada',
        text: 'Se ha cancelado la creación del comentario.'
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
        this.notificacion.fechaNotificacion = new Date().toISOString();
        this.notificacion.idUsuarioRemitente = this.compania.idCreador;
        this.notificacion.tipoNotificacion = "meGustaCompania";
        this.notificacionService.createNotificacion(this.notificacion).subscribe(
          ()=> {
          }
        )
    });
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
  
}
