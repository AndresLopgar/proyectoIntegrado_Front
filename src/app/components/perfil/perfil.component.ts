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

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router, private companiaService: CompaniaService) { }
  
  companias: Compania[] = [];
  usuarioId!: number;
  usuario!: Usuario;
  usuarioIdFromLocalStorage!: number;
  mostrandoFormularioModificar: boolean = false;
  mostrandoFormularioEliminar: boolean = false;
  showPassword: boolean = false;
  compania!: Compania;

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
        this.loadCompaniasByIdCreador(this.usuarioIdFromLocalStorage);
      }
    });
  
    console.log(this.compania);
  }
  
  loadCompaniasByIdCreador(id:number){
    this.companiaService.getCompaniasByIdCreador(id).subscribe(
      (companias) => {
        this.compania = companias;
        console.log(this.compania);
      },
      (error) => {
        // Manejar errores
        console.error('Error al obtener las compañías:', error);
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
        console.log('Perfil del usuario cargado exitosamente:', this.usuario);
      },
      error => {
        console.error('Error al cargar perfil del usuario:', error);
        // Manejar el error aquí
      }
    );
  } 


  crearCompania(){
    this.compania.fechaCreacion = new Date().toISOString();
    // Llamar al servicio para registrar al usuario
    this.companiaService.createCompania(this.compania).subscribe(
      id => {
        console.log(`compañía registrada con ID: ${id}`);
        // Redirigir a la página de inicio después de que el usuario se registre exitosamente
        this.router.navigateByUrl('/home');
        Swal.fire({
          icon: 'success',
          title: 'Registro de compañía exitoso',
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Comprueba que los datos introducidos sean correctos'
        });
      }
    );
    this.mostrandoFormularioEliminar = false; // Ocultar el formulario después de crear la compañia
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
      localStorage.removeItem('usuario');
        localStorage.setItem('tipoUsuario', 'noRegistrado');
      // Llamar al servicio para eliminar la publicación
      this.usuarioService.deleteUsuario(id).subscribe( () => {
            console.log(`Usario con ID ${id} eliminado correctamente`);
          },
          error => {
            console.error('Error al eliminar el usuario:', error);
          }
        );
        await this.router.navigateByUrl('/login');
        window.location.reload();

    } else {
      // El usuario ha cancelado la acción
      console.log('La acción ha sido cancelada');
    }
  }

  mostrarFormularioModificar(): void {
    this.mostrandoFormularioModificar = true;
  }

  mostrarFormularioEliminar(): void {
    this.mostrandoFormularioEliminar = true;
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

  seguirUsuario(event: Event) {
    event.stopPropagation(); // Evitar la propagación del evento clic
  }

  quitarLocalStorage(){
    localStorage.removeItem('usuario');
    localStorage.setItem('tipoUsuario', 'noRegistrado');
    console.log('Sesión cerrada exitosamente');
    this.router.navigateByUrl('/login');
    window.location.reload();
  }
}
