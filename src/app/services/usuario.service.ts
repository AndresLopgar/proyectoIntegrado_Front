import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { usuario, usuariosMock } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  /*EndPoint correcto
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAllUsuarios(): Observable<usuario[]> {
    return this.http.get<usuario[]>(this.baseUrl);
  }
  */

  constructor() { }

  getAllUsuarios(): Observable<usuario[]> {
    // Aquí puedes usar datos mockeados en lugar de hacer una solicitud HTTP
    return of(usuariosMock);
  }
}
