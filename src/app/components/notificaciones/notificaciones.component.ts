import { Component, OnInit } from '@angular/core';
import { NotificacionService } from '../../services/notificacion.service';
import { Notificacion } from '../../model/notificacion';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { CompaniaService } from '../../services/compania.service';
import { Compania } from '../../model/compania';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss'
})
export class NotificacionesComponent implements OnInit{

  constructor(private notificacionService: NotificacionService,
    private usuarioService: UsuarioService,
    private companiaService: CompaniaService,
    private router: Router, 
  ){}

  usuarioIdFromLocalStorage!: number;
  notificaciones: Notificacion[] = [];
  usuariosCargados: { [id: number]: Usuario } = {};
  compania!: Compania;
  loader: boolean = false;
  esCreador: boolean = false;

  ngOnInit(): void {     
      const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
        this.cargarNotificacionesByIdRemitente(this.usuarioIdFromLocalStorage);
        this.loadCompaniaByIdCreador(this.usuarioIdFromLocalStorage);
      }
      setTimeout(() => {
        this.loader = true;
    }, 1500);
  }

  cargarNotificacionesByIdRemitente(id: number) {
    this.notificacionService.getNotificacionesByUsuarioRemitente(id).subscribe(
      notificaciones => {
        this.notificaciones = notificaciones;
        notificaciones.forEach(notificacion => {
          this.loadUsuario(notificacion.idUsuarioEmisor);
        });
      },
      error => {
        console.error('Error al cargar notificaciones del remitente:', error);
      }
    );
  }

  loadUsuario(id: number) {
    if (!this.usuariosCargados[id]) {
      this.usuarioService.getUsuarioById(id).subscribe(
        usuario => {
          this.usuariosCargados[id] = usuario;
        },
        error => {
          console.error(`Error al cargar usuario con id ${id}:`, error);
        }
      );
    }
  }

  eliminarNotificacion(id: number){
    this.notificacionService.deleteNotificacion(id).subscribe(() =>
    location.reload())
  }

  loadCompaniaByIdCreador(id:number){
    this.companiaService.getCompaniaByIdCreador(id).subscribe(
      (compania) => {
        this.compania = compania;
        this.esCreador = true;
      },
      (error) => {
        // Manejar errores
        console.error('Este usuario no tiene compañia');
      }
    );
  }

  irAlPerfilUsuario(idUsuario: number) {
    // Navegar al perfil del usuario
    this.router.navigate(['/perfil', idUsuario]);
  }
}
