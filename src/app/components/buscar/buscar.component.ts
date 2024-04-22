import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { usuario} from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [ButtonModule, CommonModule, HttpClientModule],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.scss'
})
export class BuscarComponent implements OnInit{
  usuarios: usuario[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.getAllUsuario();
  }

  getAllUsuario(){
    this.usuarioService.getAllUsuarios().subscribe(
      data => {
        this.usuarios = data;
        console.log(this.usuarios);
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

}
