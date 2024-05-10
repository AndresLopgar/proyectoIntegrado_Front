import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Usuario} from '../../model/usuario';
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
  styleUrl: './buscar.component.scss'
})
export class BuscarComponent implements OnInit{
  companias: Compania[] = [];
  usuarios: Usuario[] = [];
  usuarioLocalStorage: Usuario | null = null;

  constructor(private usuarioService: UsuarioService, private router: Router, private companiaService: CompaniaService) { }

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
          this.usuarios = usuarios.filter(usuario => usuario.id !== this.usuarioLocalStorage?.id);
        } else {
          this.usuarios = usuarios;
        }
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
          this.companias = companias.filter(compania => compania.id !== this.usuarioLocalStorage!.companiaSeguida);
        } else {
          this.companias = companias;
        }
      },
      error => {
        console.log('Error al recuperar compañías:', error);
      }
    );
  }
  

  usuarioEstandarChecked: boolean = false;

  toggleCamposUsuarioEstandar(event: any) {
    this.usuarioEstandarChecked = event.target.checked;
  }

  goPerfil(usuarioId: number) {
    this.router.navigate(['/perfil', usuarioId]); // Suponiendo que la ruta para el perfil sea '/perfil'
  }

  goCompania(companiaID: number){
    this.router.navigate(['/compania', companiaID]);
  }

seguirUsuario(event: Event) {
  event.stopPropagation(); // Evitar la propagación del evento clic
}


}
