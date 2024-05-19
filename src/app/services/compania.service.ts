import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compania } from '../model/compania';


@Injectable({
  providedIn: 'root',
})
export class CompaniaService {
  //heroku
  //private baseUrl = 'https://artconnect-9bc127224463.herokuapp.com/api/companias';

  //localhost
  private baseUrl = 'http://localhost:8081/api/companias';

  usuarioEncontrado: any;

  constructor(private http: HttpClient) { }

  getAllCompanias(): Observable<Compania[]> {
    return this.http.get<Compania[]>(this.baseUrl);
  }
  
  createCompania(compania: Compania): Observable<number> {
    return this.http.post<number>(this.baseUrl, compania);
  }

  deleteCompania(id: number): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }

  getCompaniaById(id: number): Observable<Compania> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Compania>(url);
  }

  updateCompania(id: number, compania: Compania): Observable<number> {
    const url = `${this.baseUrl}/update/${id}`;
    return this.http.put<number>(url, compania);
  }

  getCompaniaByIdCreador(id: number): Observable<Compania> {
    const url = `${this.baseUrl}/creator/${id}`;
    return this.http.get<Compania>(url);
  }

  updateMiembrosCompania(id: number, nuevosMiembros: number): Observable<number> {
    const url = `${this.baseUrl}/updateMiembros/${id}`;
    return this.http.put<number>(url, nuevosMiembros);
  }
  
}
