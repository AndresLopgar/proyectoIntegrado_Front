import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../model/usuario';
import { AmistadService } from '../../services/amistad.service';
import { Amistad } from '../../model/amistad';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.scss'
})
export class MensajesComponent implements OnInit{

  usuariosSeguidos!: Usuario[];
  amistadesBySeguidor!: Amistad[];
  usuarioId!: number;
  estaEnAmistad: boolean = false;
  usuarioIdFromLocalStorage!: number;

  constructor (private usuarioService: UsuarioService, private amistadService: AmistadService,private route: ActivatedRoute, ){}

  ngOnInit() {
      // Cargar el perfil del usuario utilizando el ID
      const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
        this.loadUsuarioSeguidos(this.usuarioIdFromLocalStorage);
      }
  }

  loadUsuarioSeguidos(id: number){
    this.amistadService.findBySeguidor(id).subscribe(
      (amistades) => {
        this.amistadesBySeguidor = amistades;
  
        if (this.amistadesBySeguidor.some(amistad => 
            amistad.idSeguidor === this.usuarioIdFromLocalStorage)) {
          this.estaEnAmistad = true;
        } else {
          this.estaEnAmistad = false;
        }
        
        this.usuariosSeguidos = [];
        let userIds = new Set<number>(); // Conjunto para almacenar los IDs de los usuarios ya agregados
  
        this.amistadService.getAllAmistades().subscribe(
          amistades =>{
            this.amistadesBySeguidor = amistades;
            for (let i = 0; i <  this.amistadesBySeguidor.length; i++) {
              if (!userIds.has(this.amistadesBySeguidor[i].idSeguido) && this.amistadesBySeguidor[i].idSeguido !== this.usuarioIdFromLocalStorage && this.amistadesBySeguidor[i].idSeguidor == this.usuarioIdFromLocalStorage) {
                this.usuarioService.getUsuarioById(this.amistadesBySeguidor[i].idSeguido).subscribe(
                    seguido => {
                        this.usuariosSeguidos.push(seguido);
                    });
                userIds.add(this.amistadesBySeguidor[i].idSeguido);
              }
            }
          })
      });
  }


}
