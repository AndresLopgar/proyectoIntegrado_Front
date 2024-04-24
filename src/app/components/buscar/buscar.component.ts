import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Usuario} from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [ButtonModule, CommonModule, HttpClientModule],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.scss'
})
export class BuscarComponent implements OnInit{
  usuarios: Usuario[] = [];
  usuarioLocalStorage: Usuario | null = null;

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.getAllUsuarios();
    const usuarioString = localStorage.getItem('usuario');
  if (usuarioString !== null) {
    this.usuarioLocalStorage = JSON.parse(usuarioString);
  }
  }

  getAllUsuarios() {
    this.usuarioService.getAllUsuarios().subscribe(
      data => {
        if (this.usuarioLocalStorage) {
          this.usuarios = data.filter(usuario => usuario.id !== this.usuarioLocalStorage?.id);
        } else {
          this.usuarios = data;
        }
      },
      error => {
        console.log('Error al recuperar usuarios:', error);
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

seguirUsuario(event: Event) {
  event.stopPropagation(); // Evitar la propagación del evento clic
}


}
