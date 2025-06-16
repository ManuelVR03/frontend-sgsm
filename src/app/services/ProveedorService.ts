import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProveedorService {
  private readonly API_URL = `${environment.apiUrl}/apiProveedores`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/proveedor`, {
      headers: this.getAuthHeaders()
    });
  }

  getProveedorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/proveedor/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}