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

@Component({
  selector: 'app-compania',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
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
  usuarioLocalStorage: any;
  usuarioActual!: Usuario;

  constructor(private companiaService: CompaniaService, private route: ActivatedRoute,private router: Router, private usuarioService: UsuarioService){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.companiaId = +params['id'];
      
      const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioId = usuarioAlmacenado.id;
        this.loadUsuarioById(this.usuarioId);
      }
      
      this.loadCompania();
      this.getAllUsuarios();
    })
  }

  loadCompania(){
    this.companiaService.getCompaniaById(this.companiaId).subscribe(
      (compania) => {
        this.compania = compania;
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
        console.log(this.usuarioActual);
      },
      error => {
        console.error('Error al cargar perfil del usuario:', error);
      }
    );
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
    try {
      await this.companiaService.updateCompania(this.compania.id, this.compania).toPromise();
      console.log('Compañía modificada exitosamente.');
      this.mostrandoFormularioModificar = false;
      Swal.fire({
        icon: 'success',
        title: 'Modificación de compañía exitosa',
        text: '¡Compañía modificada correctamente!'
      });
    } catch (error) {
      console.error('Error al modificar la compañía:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '¡Error al modificar la compañía!'
      });
    }
  }

  mostrarFormularioModificar(): void {
    this.mostrandoFormularioModificar = true;
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
    // Obtener el usuario actual
    const usuarioLocalStorage = localStorage.getItem('usuario');
    if (usuarioLocalStorage) {
      const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
      const userId = usuarioAlmacenado.id;
      
      // Actualizar el atributo companiaSeguida del usuario a 0
      this.usuarioService.updateCompaniaSeguida(userId, 0).subscribe(
        () => {
          console.log('companiaSeguida actualizado a 0 correctamente');
          
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
      this.router.navigateByUrl('/home');
    }
  }
  
  entrarCompania(idCompania: number) {
    // Obtener el usuario actual
    const usuarioLocalStorage = localStorage.getItem('usuario');
    if (usuarioLocalStorage) {
      const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
      const userId = usuarioAlmacenado.id;
      
      // Actualizar el atributo companiaSeguida del usuario
      this.usuarioService.updateCompaniaSeguida(userId, idCompania).subscribe(
        () => {
          console.log('companiaSeguida actualizado correctamente');
          
          // Obtener el valor actual del atributo miembros de la compañía
          this.companiaService.getCompaniaById(idCompania).subscribe(
            (compania: Compania) => {
              const nuevosMiembros = compania.miembros + 1;
              // Actualizar el atributo miembros de la compañía
              this.companiaService.updateMiembrosCompania(idCompania, nuevosMiembros).subscribe(
                () => {
                  console.log('Atributo miembros incrementado correctamente.');
                  this.router.navigateByUrl('/home');
                },
                error => {
                  console.error('Error al incrementar el atributo miembros:', error);
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
      this.router.navigateByUrl('/home');
    }
  }
  
  
  
}
