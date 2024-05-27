import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { filter } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.scss'
})
export class CabeceraComponent implements OnInit {
  tipoUsuario = "";
  titulo: string = "";
  idUsuario!:number;
  fotoPerfilUsuario!: string;

  constructor(private router: Router,) {}

  ngOnInit(): void {
    // Escucha cambios en la ruta para actualizar el título
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.ActualizaTitulo();
    });

    // Recuperar el usuario almacenado en Local Storage y actualizar el tipo de usuario
    const usuarioLocalStorage = localStorage.getItem('usuario');
    if (usuarioLocalStorage) {
      const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
      this.tipoUsuario = usuarioAlmacenado.tipoUsuario;
      this.idUsuario = usuarioAlmacenado.id;
      this.fotoPerfilUsuario = usuarioAlmacenado.fotoPerfil;
    }else{
      this.tipoUsuario= "noRegistrado";
    }
  }

  ActualizaTitulo(): void {
    const currentRoute = this.router.routerState.snapshot.url;
  
    switch (true) {
      case currentRoute === '/home':
        this.titulo = 'Inicio';
        break;
      case currentRoute === '/login':
        this.titulo = 'Inicio Sesión';
        break;
      case currentRoute === '/registro':
        this.titulo = 'Registro Usuario';
        break;
      case currentRoute === '/buscar':
        this.titulo = 'Buscar';
        break;
      case currentRoute === '/notificaciones':
        this.titulo = 'Notificaciones';
        break;
      case currentRoute === '/moderar':
        this.titulo = 'Moderación';
        break;
      case currentRoute.includes('/compania'):
        this.titulo = 'Compañía';
        break;
        case currentRoute.includes('/mensajes'):
        this.titulo = 'mensajes';
        break;
      case currentRoute.includes('/perfil'):
        this.titulo = 'Perfil';
        break;
    }
    
  }

  goPerfil(usuarioId: number) {
    this.router.navigate(['/perfil', usuarioId]); 
}

  goMensajes(usuarioId: number) {
    this.router.navigate(['/mensajes', usuarioId]);
  }

  navegarlogin(){
    this.router.navigateByUrl('/login'); 
  }

  navegarHome(){
    this.router.navigateByUrl('/home'); 
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
}
