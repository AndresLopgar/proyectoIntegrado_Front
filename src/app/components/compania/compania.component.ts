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
  tieneCompania: number = 0;

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
  
  
}
