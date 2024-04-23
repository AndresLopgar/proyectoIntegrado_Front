import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8081/api/usuarios';
  usuarioEncontrado: any;

  constructor(private http: HttpClient) { }

  getAllUsuarios(): Observable<usuario[]> {
    return this.http.get<usuario[]>(this.baseUrl);
  }
  
  createUsuario(usuario: usuario): Observable<number> {
    return this.http.post<number>(this.baseUrl, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  getUsuarioById(id: number): Observable<usuario> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<usuario>(url);
  }
}
