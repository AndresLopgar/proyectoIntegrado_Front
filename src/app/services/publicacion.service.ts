import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publicacion } from '../model/publicacion';

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {
  private baseUrl = 'http://localhost:8081/api/publicaciones';

  constructor(private http: HttpClient) {}

  getAllPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.baseUrl);
  }

  createPublicacion(publicacion: Publicacion): Observable<number> {
    return this.http.post<number>(this.baseUrl, publicacion);
  }

  deletePublicacion(id: number): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }

  getPublicacionById(id: number): Observable<Publicacion> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Publicacion>(url);
  }

  updatePublicacion(id: number, publicacion: Publicacion): Observable<number> {
    const url = `${this.baseUrl}/update/${id}`;
    return this.http.put<number>(url, publicacion);
  }

  getAllPublicacionesByUsuario(idUsuario: number): Observable<Publicacion[]> {
    const url = `${this.baseUrl}/usuario/${idUsuario}`;
    return this.http.get<Publicacion[]>(url);
  }

  getAllPublicacionesByCompania(idCompania: number): Observable<Publicacion[]> {
    const url = `${this.baseUrl}/compania/${idCompania}`;
    return this.http.get<Publicacion[]>(url);
  }
}
