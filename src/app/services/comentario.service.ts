import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../model/comentario'; // Asegúrate de importar el modelo correcto

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {

  //heroku
  //private baseUrl = 'https://artconnect-9bc127224463.herokuapp.com/api/comentarios';

  //localhost
  private baseUrl = 'http://localhost:8081/api/comentarios';

  constructor(private http: HttpClient) { }

  // Método para obtener todos los comentarios
  getAllComentarios(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(this.baseUrl);
  }
  
  // Método para crear un comentario
  createComentario(comentario: Comentario): Observable<number> {
    return this.http.post<number>(this.baseUrl, comentario);
  }

  // Método para eliminar un comentario por su ID
  deleteComentario(id: number): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }

  // Método para obtener un comentario por su ID
  getComentarioById(id: number): Observable<Comentario> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Comentario>(url);
  }

  // Método para actualizar un comentario por su ID
  updateComentario(id: number, comentario: Comentario): Observable<number> {
    const url = `${this.baseUrl}/update/${id}`;
    return this.http.put<number>(url, comentario);
  }

  getComentariosByPublicacionId(idPublicacion: number): Observable<Comentario[]> {
    const url = `${this.baseUrl}/publicacion/${idPublicacion}`;
    return this.http.get<Comentario[]>(url);
  }
}
