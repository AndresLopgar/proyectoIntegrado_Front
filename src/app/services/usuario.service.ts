import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAllUsuarios(): Observable<usuario[]> {
    return this.http.get<usuario[]>(this.baseUrl);
  }
}
