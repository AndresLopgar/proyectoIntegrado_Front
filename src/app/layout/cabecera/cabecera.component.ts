import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { filter } from 'rxjs';


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
  idUsuario:number | undefined;

  constructor(private router: Router) {}

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
    }else{
      this.tipoUsuario= "noRegistrado";
    }
    console.log(this.tipoUsuario);
    
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
      case currentRoute === '/mensajes':
        this.titulo = 'Mensajes';
        break;
      case currentRoute === '/notificaciones':
        this.titulo = 'Notificaciones';
        break;
      case currentRoute === '/moderar':
        this.titulo = 'Moderación';
        break;
      case currentRoute === '/companiaRegistro':
        this.titulo = 'Registro Compañía';
        break;
      case currentRoute.startsWith('/perfil'):
        this.titulo = 'Perfil';
        break;
    }
    
  }

  navegarlogin(){
    this.router.navigateByUrl('/login'); 
  }

  navegarHome(){
    this.router.navigateByUrl('/home'); 
  }
}
