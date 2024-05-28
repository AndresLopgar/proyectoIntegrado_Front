import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompaniaService } from '../../services/compania.service';
import { Compania } from '../../model/compania';
import { LoaderComponent } from '../../layout/loader/loader.component';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [ButtonModule, CommonModule, HttpClientModule, LoaderComponent],
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})
export class BuscarComponent implements OnInit {
  companias: Compania[] = [];
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  companiasFiltradas: Compania[] = [];
  usuarioLocalStorage: Usuario | null = null;
  filtroTipo: string = '';
  loader: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private companiaService: CompaniaService
  ) {}

  ngOnInit(): void {
    this.getAllUsuarios();
    this.getAllCompanias();
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString !== null) {
      this.usuarioLocalStorage = JSON.parse(usuarioString);
    }
    setTimeout(() => {
      this.loader = true;
  }, 1500);
  }

  getAllUsuarios() {
    this.usuarioService.getAllUsuarios().subscribe(
      usuarios => {
        // Filtrar usuarios que no sean admins
        usuarios = usuarios.filter(usuario => usuario.tipoUsuario !== 'admin');

        if (this.usuarioLocalStorage) {
          this.usuarios = usuarios.filter(
            usuario => usuario.id !== this.usuarioLocalStorage?.id
          );
        } else {
          this.usuarios = usuarios;
        }
        this.usuariosFiltrados = [...this.usuarios];
      },
      error => {
        console.log('Error al recuperar usuarios:', error);
      }
    );
  }

  getAllCompanias() {
    this.companiaService.getAllCompanias().subscribe(
      companias => {
        if (this.usuarioLocalStorage && this.usuarioLocalStorage.companiaSeguida) {
          this.companias = companias.filter(
            compania => compania.id !== this.usuarioLocalStorage!.companiaSeguida
          );
        } else {
          this.companias = companias;
        }
        this.companiasFiltradas = [...this.companias]; // Inicialmente, mostrar todas las compañías
      },
      error => {
        console.log('Error al recuperar compañías:', error);
      }
    );
  }

  filtrarUsuariosYCompanias(event: any) {
    const texto = (event.target as HTMLInputElement).value.trim(); // Eliminamos espacios en blanco al inicio y al final
    this.usuariosFiltrados = this.usuarios.filter(
      usuario =>
        usuario.nombre.toUpperCase().startsWith(texto.toUpperCase())
    );
  
    this.companiasFiltradas = this.companias.filter(compania =>
      compania.nombre.toUpperCase().startsWith(texto.toUpperCase())
    );
  }

  goPerfil(usuarioId: number) {
    this.router.navigate(['/perfil', usuarioId]);
  }

  goCompania(companiaID: number) {
    this.router.navigate(['/compania', companiaID]);
  }

  mostrarFiltros(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filtroTipo = target.value;

    if (this.filtroTipo === 'usuarios') {
      this.usuariosFiltrados = [...this.usuarios];
    } else if (this.filtroTipo === 'companias') {
      this.companiasFiltradas = [...this.companias];
    } else {
      this.usuariosFiltrados = [...this.usuarios];
      this.companiasFiltradas = [...this.companias];
    }
  }

  aplicarFiltrosUsuarios() {
    const edadMin = parseInt((document.getElementById('edadMin') as HTMLInputElement).value, 10);
    const edadMax = parseInt((document.getElementById('edadMax') as HTMLInputElement).value, 10);
    const profesion = (document.getElementById('profesion') as HTMLSelectElement).value;

    this.usuariosFiltrados = this.usuarios.filter(usuario => {
        const cumpleEdad = usuario.edad >= edadMin && usuario.edad <= edadMax;
        const cumpleProfesion = profesion ? usuario.profesion === profesion : true;
        return cumpleEdad && cumpleProfesion;
    });

    console.log('Usuarios filtrados:', this.usuariosFiltrados);
}


  limpiarFiltrosUsuarios() {
    (document.getElementById('edadMin') as HTMLInputElement).value = '16';
    (document.getElementById('edadMax') as HTMLInputElement).value = '100';
    (document.getElementById('profesion') as HTMLSelectElement).value = '';

    // Implementar la lógica para limpiar los filtros de los usuarios
    console.log('Limpiar filtros de usuarios');
  }

  aplicarFiltrosCompanias() {
    const minMiembros = parseInt((document.getElementById('minMiembros') as HTMLInputElement).value, 10);
    const maxMiembros = parseInt((document.getElementById('maxMiembros') as HTMLInputElement).value, 10);
    const fechaCreacion = (document.getElementById('fechaCreacion') as HTMLInputElement).value;
    console.log(fechaCreacion);
    

    this.companiasFiltradas = this.companias.filter(compania => {
      const cumpleMiembros = compania.miembros >= minMiembros && compania.miembros <= maxMiembros;

      let cumpleFechaCreacion = true;
      if (fechaCreacion) {
          const companiaFecha = new Date(compania.fechaCreacion).toISOString().split('T')[0];
          cumpleFechaCreacion = companiaFecha === fechaCreacion;
      }

      return cumpleMiembros && cumpleFechaCreacion;
  });

    console.log('Compañías filtradas:', this.companiasFiltradas);
}


  limpiarFiltrosCompanias() {
    (document.getElementById('minMiembros') as HTMLInputElement).value = '1';
    (document.getElementById('maxMiembros') as HTMLInputElement).value = '1';
    (document.getElementById('fechaCreacion') as HTMLInputElement).value = '';

    // Implementar la lógica para limpiar los filtros de las compañías
    console.log('Limpiar filtros de compañías');
  }
  
}
