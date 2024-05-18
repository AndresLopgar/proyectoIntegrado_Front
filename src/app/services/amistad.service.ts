import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Amistad } from '../model/amistad';

@Injectable({
  providedIn: 'root',
})
export class AmistadService {
  //heroku
  private baseUrl = 'https://artconnect-9bc127224463.herokuapp.com/api/amistades';

  //localhost
  //private baseUrl = 'http://localhost:8081/api/amistades';

  constructor(private http: HttpClient) { }

  getAllAmistades(): Observable<Amistad[]> {
    return this.http.get<Amistad[]>(this.baseUrl);
  }
  
  createAmistad(amistad: Amistad): Observable<number> {
    return this.http.post<number>(this.baseUrl, amistad);
  }

  deleteAmistad(id: number): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }

  getAmistadById(id: number): Observable<Amistad> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Amistad>(url);
  }

  updateAmistad(id: number, amistad: Amistad): Observable<number> {
    const url = `${this.baseUrl}/update/${id}`;
    return this.http.put<number>(url, amistad);
  }
  
  findBySeguidor(idSeguidor: number): Observable<Amistad[]> {
    const url = `${this.baseUrl}/seguidor/${idSeguidor}`;
    return this.http.get<Amistad[]>(url);
  }

  findBySeguido(idSeguido: number): Observable<Amistad[]> {
    const url = `${this.baseUrl}/seguido/${idSeguido}`;
    return this.http.get<Amistad[]>(url);
  }
}
