import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { PublicacionService } from '../../services/publicacion.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Publicacion } from '../../model/publicacion';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { CompaniaService } from '../../services/compania.service';
import { Compania } from '../../model/compania';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, RouterLink],
  providers:[UsuarioService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('publicacionForm') publicacionForm!: NgForm; // Referencia al formulario
  usuarios: Usuario[] = [];
  publicaciones: Publicacion[] = [];
  usuarioIdFromLocalStorage!: number;
  noHayUsuarioIniciado: boolean = false;
  usuariosCargados: { [id: number]: Usuario } = {};
  publicacion: Publicacion = {
    id: 0,
    contenido: "",
    fechaPublicacion: "",
    meGusta: false,
    numMeGustas: 0,
    idUsuario: 0,
    idCompania: 0
  };

  mostrarCrear: boolean = false;
  companiasCargadas: { [id: number]: Compania } = {};
  publicacionesLiked: Set<number> = new Set();

  constructor(private usuarioService: UsuarioService, 
    private publicacionService: PublicacionService,
    private companiaService: CompaniaService, 
    private router: Router) { 
    const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
        this.noHayUsuarioIniciado = true;
      }
  }

  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe(
      data => {
        this.usuarios = data;
      },
      error => {
        console.log('Error al recuperar usuarios:', error);
      }
    );

    this.publicacionService.getAllPublicaciones().subscribe(
      publicaciones => {
          this.publicaciones = publicaciones;
          this.publicaciones.forEach(publicacion => {
              if (publicacion.idCompania !== null) {
                  this.loadCompaniaById(publicacion.idCompania);
              }
              // También puedes cargar el usuario asociado a la publicación si es necesario
              this.loadUsuarioById(publicacion.idUsuario);
          });
      }
  );
  
  }
  loadCompaniaById(idCompania: number) {
    this.companiaService.getCompaniaById(idCompania).subscribe(
      (compania: Compania) => {
        this.companiasCargadas[idCompania] = compania;
      },
      (error) => {
        // Manejar errores
        console.error('Error al cargar compañía por ID:', error);
      }
    );
  }

  irAlPerfilUsuario(usuario: Usuario) {
    this.router.navigate(['/perfil', usuario.id]);
  }

  irAlLogin(){
    this.router.navigate(['/login']);
  }

  irAlPerfilCompania(compania: Compania) {
    this.router.navigate(['/compania', compania.id]);
  }

  loadUsuarioById(id: number) {
    this.usuarioService.getUsuarioById(id).subscribe(
      (usuario: Usuario) => {
        this.usuariosCargados[id] = usuario;
      },
      error => {
        console.error('Error al cargar perfil del usuario:', error);
      }
    );
  }

  mostrarCrearPublicacion(){
    this.mostrarCrear = true;
  }

  cerrarCrearPublicacion() {
    // Mostrar un mensaje de advertencia al cancelar la creación de la publicación
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Has cancelado la creación de la publicación.',
      showConfirmButton: false,
      timer: 1500 
    });
    this.mostrarCrear = false;
  }
  

  crearPublicacionUsuario() {
    this.publicacion.fechaPublicacion = new Date().toISOString();
    this.publicacion.idUsuario = this.usuarioIdFromLocalStorage;
  
    this.publicacionService.createPublicacion(this.publicacion).subscribe(
      id => {
        Swal.fire(
          'Publicación creada',
          'La publicación se ha creado correctamente.',
          'success'
        );
        this.publicacionForm.resetForm();
        this.mostrarCrear = false;
        this.router.navigate(['/perfil',  this.usuarioIdFromLocalStorage]);
      },
      error => {
        Swal.fire(
          'Error',
          'Ha ocurrido un error al crear la publicación. Por favor, inténtalo de nuevo más tarde.',
          'error'
        );
      }
    );
  }

  darMeGusta(publicacion: Publicacion) {
    if (this.publicacionesLiked.has(publicacion.id)) {
      publicacion.numMeGustas--;
      this.publicacionesLiked.delete(publicacion.id); // Quitar la publicación de las que tienen "Me Gusta"
    } else {
      publicacion.numMeGustas++;
      this.publicacionesLiked.add(publicacion.id); // Agregar la publicación a las que tienen "Me Gusta"
    }
    // Actualizar la publicación en el servicio
    this.publicacionService.updatePublicacion(publicacion.id, publicacion).subscribe(() => {
    });
  }
  

}
