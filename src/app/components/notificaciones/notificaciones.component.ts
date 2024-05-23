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
import { toZonedTime } from 'date-fns-tz';
import { addHours, format } from 'date-fns';
import { ButtonModule } from 'primeng/button';
import { AmistadService } from '../../services/amistad.service';



@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ButtonModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss'
})
export class NotificacionesComponent implements OnInit{

  constructor(private notificacionService: NotificacionService,
    private usuarioService: UsuarioService,
    private companiaService: CompaniaService,
    private amistadService: AmistadService,
    private router: Router, 
  ){}

  usuarioIdFromLocalStorage!: number;
  notificaciones: Notificacion[] = [];
  usuariosCargados: { [id: number]: Usuario } = {};
  companiasCargadas: { [id: number]: Compania } = {};
  compania!: Compania;
  loader: boolean = false;
  esCreador: boolean = false;
  estaEnCompania: boolean = false;
  usuario!: Usuario;
  imagenesCompanias: string[] = [   // Rutas de las imágenes
    '../../../assets/perfiles/companias/imagenCompania1.png',
    '../../../assets/perfiles/companias/imagenCompania2.png',
    '../../../assets/perfiles/companias/imagenCompania3.png',
    '../../../assets/perfiles/companias/imagenCompania4.png',
    '../../../assets/perfiles/companias/imagenCompania5.png',
  ];
  filtroTipo: string = '';
  notificacionesFiltradas: Notificacion[] = [];
  esSeguidor: boolean = false;
  usuariosSeguidos: Usuario[] = [];

  ngOnInit(): void {     
      const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
        this.cargarNotificacionesByIdRemitente(this.usuarioIdFromLocalStorage);
        this.loadCompaniaByIdCreador(this.usuarioIdFromLocalStorage);
        this.loadUsuarioFromLocalStorage();
        this.compruebaEsSeguidor(this.usuarioIdFromLocalStorage);
      }
      setTimeout(() => {
        this.loader = true;
    }, 1500);
    this.loadCompania();
  }

formatDateToLocal(date: string): string {
  const zonedDate = toZonedTime(new Date(date), 'Europe/Madrid');
  const zonedDatePlusTwoHours = addHours(zonedDate, 2); // Agrega dos horas
  return format(zonedDatePlusTwoHours, 'dd/MM/yyyy HH:mm');
}

  cargarNotificacionesByIdRemitente(id: number) {
    this.notificacionService.getNotificacionesByUsuarioRemitente(id).subscribe(
      notificaciones => {
        // Ordenar las notificaciones por fecha de más reciente a más antigua
        this.notificaciones = notificaciones.sort((a, b) => {
          return new Date(b.fechaNotificacion).getTime() - new Date(a.fechaNotificacion).getTime();
        });
        this.notificacionesFiltradas = [...this.notificaciones];
  
        notificaciones.forEach(notificacion => {
          this.loadUsuario(notificacion.idUsuarioEmisor);
        });
      },
      error => {
        console.error('Error al cargar notificaciones del remitente:', error);
      }
    );
  }

  filtrarNotificaciones(event: Event) {
    const target = event.target as HTMLSelectElement;
    const tipo = target.value;
  
    if (tipo === 'todos') {
      this.notificacionesFiltradas = [...this.notificaciones];
    } else {
      this.notificacionesFiltradas = this.notificaciones.filter(notificacion => notificacion.tipoNotificacion === tipo);
      console.log(this.notificacionesFiltradas);
      
    }
  }
  
  loadUsuarioFromLocalStorage(){
    this.usuarioService.getUsuarioById(this.usuarioIdFromLocalStorage).subscribe(
      usuario => {
        this.usuario = usuario;
        const companiaSeguidaId = usuario.companiaSeguida;
        if (companiaSeguidaId) {
          this.companiaService.getAllCompanias().subscribe(
            companias => {
              for (const compania of companias) {
                if (compania.id === companiaSeguidaId) {
                  this.estaEnCompania = true;
                  break; 
                }}},
            error => {
              console.error('Error al cargar todas las compañías:', error);
            });
          }},
      error => {
        console.error('Error al cargar usuario desde el almacenamiento local:', error);
      });
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

  loadCompania(){
    this.companiaService.getAllCompanias().subscribe(
      companias => {
        companias.forEach(compania => {
          if(this.usuario.companiaSeguida === compania.id && this.usuario.id != compania.idCreador){
            this.compania = compania;
            console.log(compania);
          }
        });
      }
    )
  }

  eliminarNotificacion(id: number){
    this.notificacionService.deleteNotificacion(id).subscribe(() =>
    location.reload())
  }

  eliminarNotificaciones() {
    this.notificacionService.getAllNotificaciones().subscribe(
      notificaciones => {
        notificaciones.forEach(notificacion => {
          if (notificacion.idUsuarioRemitente === this.usuarioIdFromLocalStorage) {
            this.eliminarNotificacion(notificacion.id);
          }
        });
        this.router.navigateByUrl('/notificaciones');
      },
      error => {
        console.error('Error al cargar notificaciones:', error);
      }
    );
  }

  compruebaEsSeguidor(usuarioId: number) {
    this.amistadService.findBySeguidor(usuarioId).subscribe(amistades => {
      this.esSeguidor = amistades.some(amistad => amistad.idSeguidor === this.usuarioIdFromLocalStorage);
      if (this.esSeguidor) {
        this.cargarUsuariosSeguidos(amistades);
      }
    });
  }

  cargarUsuariosSeguidos(amistades: any[]) {
    amistades.forEach(amistad => {
      if (amistad.idSeguidor === this.usuarioIdFromLocalStorage) {
        this.usuarioService.getUsuarioById(amistad.idSeguido).subscribe(usuarioSeguido => {
          this.usuariosSeguidos.push(usuarioSeguido);
        });
      }
    });
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

  irAlPerfilCompania(idCompania: number){
    this.router.navigate(['/compania', idCompania]);
  }

}


