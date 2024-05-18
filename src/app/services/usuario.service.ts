import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  //heroku
  private baseUrl = 'https://artconnect-9bc127224463.herokuapp.com/api/usuarios';

  //localhost
  //private baseUrl = 'http://localhost:8081/api/usuarios';

  usuarioEncontrado: any;

  constructor(private http: HttpClient) { }

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }
  
  createUsuario(usuario: Usuario): Observable<number> {
    return this.http.post<number>(this.baseUrl, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Usuario>(url);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<number> {
    const url = `${this.baseUrl}/update/${id}`;
    return this.http.put<number>(url, usuario);
  }

  updateCompaniaSeguida(userId: number, nuevaCompaniaSeguida: number): Observable<void> {
    const url = `${this.baseUrl}/update/${userId}/companiaSeguida?companiaSeguida=${nuevaCompaniaSeguida}`;
    return this.http.put<void>(url, {}); // Aquí se envía un cuerpo vacío
  }
  
}
