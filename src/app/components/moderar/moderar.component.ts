import { Component, OnInit } from '@angular/core';
import { ComentarioService } from '../../services/comentario.service';
import { Comentario } from '../../model/comentario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moderar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moderar.component.html',
  styleUrl: './moderar.component.scss'
})
export class ModerarComponent implements OnInit{
  comentariosCargados: Comentario[] = [];

  constructor (private comentarioService: ComentarioService){}

  ngOnInit(): void {
    this.comentarioService.getAllComentarios().subscribe(
      comentarios => {
        this.comentariosCargados = comentarios;
      }
    )
  }

  eliminarComentario(id: number){
    this.comentarioService.deleteComentario(id).subscribe(
      comentario =>{
        console.log("comentario eliminado correctamente");
        
      }
    )
  }


}
