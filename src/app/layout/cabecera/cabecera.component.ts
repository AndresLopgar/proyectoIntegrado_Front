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
  tipoUsuario: string = "noRegistrado";
  titulo: string = "";

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
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
        this.titulo = 'Registro';
        break;
      default:
        this.titulo = 'Error';
        break;
    }
  }

  navegarlogin(){
    this.router.navigateByUrl('/login'); 
  }

}
