import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioDTO } from '../modelo/UsuarioDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly API_URL = environment.apiUrl+'/apiUsuarios';

  constructor(private http: HttpClient) { }

  getUsuarios() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<UsuarioDTO[]>(`${this.API_URL}/usuario`, { headers });
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  crearUsuario(usuario: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(`${this.API_URL}/usuario`, usuario, { headers });
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(`${this.API_URL}/usuario/${id}`, usuario, { headers });
  }

  deleteUsuario(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.API_URL}/usuario/${id}`, { headers });
  }

}
