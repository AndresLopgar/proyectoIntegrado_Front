import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../model/notificacion';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  // Heroku
  // private baseUrl = 'https://artconnect-9bc127224463.herokuapp.com/api/notificaciones';

  // Localhost
  private baseUrl = 'http://localhost:8081/api/notificaciones';

  constructor(private http: HttpClient) { }

  getAllNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.baseUrl);
  }

  getNotificacionById(id: number): Observable<Notificacion> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Notificacion>(url);
  }

  createNotificacion(notificacion: Notificacion): Observable<number> {
    return this.http.post<number>(this.baseUrl, notificacion);
  }

  updateNotificacion(id: number, notificacion: Notificacion): Observable<void> {
    const url = `${this.baseUrl}/update/${id}`;
    return this.http.put<void>(url, notificacion);
  }

  deleteNotificacion(id: number): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }

  getNotificacionesByUsuarioRemitente(idUsuarioRemitente: number): Observable<Notificacion[]> {
    const url = `${this.baseUrl}/remitente/${idUsuarioRemitente}`;
    return this.http.get<Notificacion[]>(url);
  }
}
