import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje } from '../model/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private baseUrl = 'http://localhost:8081/api/Mensajes';

  constructor(private http: HttpClient) { }

  getAllMensajesDirectos(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(this.baseUrl);
  }

  createMensaje(Mensaje: Mensaje): Observable<number> {
    return this.http.post<number>(this.baseUrl, Mensaje);
  }

  deleteMensaje(id: number): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }

  getMensajeById(id: number): Observable<Mensaje> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Mensaje>(url);
  }

  updateMensaje(id: number, Mensaje: Mensaje): Observable<number> {
    const url = `${this.baseUrl}/update/${id}`;
    return this.http.put<number>(url, Mensaje);
  }
}