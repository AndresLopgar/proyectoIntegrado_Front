import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompaniaService } from '../../services/compania.service';
import { Compania } from '../../model/compania';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [ButtonModule, CommonModule, HttpClientModule],
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})
export class BuscarComponent implements OnInit {
  companias: Compania[] = [];
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  companiasFiltradas: Compania[] = [];
  usuarioLocalStorage: Usuario | null = null;

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
  }

  getAllUsuarios() {
    this.usuarioService.getAllUsuarios().subscribe(
      usuarios => {
        if (this.usuarioLocalStorage) {
          this.usuarios = usuarios.filter(
            usuario => usuario.id !== this.usuarioLocalStorage?.id
          );
        } else {
          this.usuarios = usuarios;
        }
        this.usuariosFiltrados = [...this.usuarios]; // Inicialmente, mostrar todos los usuarios
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
}
