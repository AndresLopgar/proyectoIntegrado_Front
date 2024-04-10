import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.scss'
})
export class CabeceraComponent implements OnInit{
  tipoUsuario: string = "registrado";
  titulo: string = "";

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log("el usuario es: " + this.tipoUsuario);
    
    // Escucha cambios en la ruta para actualizar el título
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.ActualizaTitulo();
    });
  }

  ActualizaTitulo(): void {
    const currentRoute = this.router.routerState.snapshot.url;

    // Asigna los títulos según la ruta actual
    switch (currentRoute) {
      case '/home':
        this.titulo = 'Inicio';
        break;
      case '/login':
        this.titulo = 'Login';
        break;
      case '/registro':
        this.titulo = 'Registro Usuario';
        break;
      case '/perfil':
        this.titulo = 'Perfil';
        break;
      case '/buscar':
        this.titulo = 'Buscar';
        break;
      case '/mensajes':
        this.titulo = 'Mensajes';
        break;
      case '/notificaciones':
        this.titulo = 'Notificaciones';
        break;
      case '/moderar':
        this.titulo = 'Moderación';
        break;
      case '/companiaRegistro':
        this.titulo = 'Registro Compañía';
        break;
      default:
        this.titulo = 'Error';
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
