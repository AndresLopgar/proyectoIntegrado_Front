import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { CompaniaService } from '../../services/compania.service';
import { Compania } from '../../model/compania';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  providers:[UsuarioService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  usuarios: Usuario[] = [];
  companias: Compania[] = [];

  constructor(private usuarioService: UsuarioService, private companiaService: CompaniaService) { }

  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe(
      data => {
        this.usuarios = data;
      },
      error => {
        console.log('Error al recuperar usuarios:', error);
      }
    );

    this.companiaService.getAllCompanias().subscribe(
      data => {
        this.companias = data;
      },
      error => {
        console.log('Error al recuperar companias:', error);
      }
    );
  }
}
