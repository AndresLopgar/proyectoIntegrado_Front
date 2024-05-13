import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDirecto } from '../model/mensajeDirecto';

@Injectable({
  providedIn: 'root'
})
export class MensajeDirectoService {
  private baseUrl = 'http://localhost:8081/api/mensajeDirectos';

  constructor(private http: HttpClient) { }

  getAllMensajesDirectos(): Observable<MensajeDirecto[]> {
    return this.http.get<MensajeDirecto[]>(this.baseUrl);
  }
  
  createMensajeDirecto(mensajeDirecto: MensajeDirecto): Observable<number> {
    return this.http.post<number>(this.baseUrl, mensajeDirecto);
  }

  deleteMensajeDirecto(id: number): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }

  getMensajeDirectoById(id: number): Observable<MensajeDirecto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<MensajeDirecto>(url);
  }

  updateMensajeDirecto(id: number, mensajeDirecto: MensajeDirecto): Observable<number> {
    const url = `${this.baseUrl}/update/${id}`;
    return this.http.put<number>(url, mensajeDirecto);
  }
}
