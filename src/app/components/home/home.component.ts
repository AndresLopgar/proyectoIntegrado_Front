import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { PublicacionService } from '../../services/publicacion.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Publicacion } from '../../model/publicacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  providers:[UsuarioService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('publicacionForm') publicacionForm!: NgForm; // Referencia al formulario
  usuarios: Usuario[] = [];
  publicaciones: Publicacion[] = [];
  usuarioIdFromLocalStorage!: number;
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

  constructor(private usuarioService: UsuarioService, private publicacionService: PublicacionService) { 
    const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
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
          this.loadUsuarioById(publicacion.idUsuario);
        });
      }
    )
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
  

}
