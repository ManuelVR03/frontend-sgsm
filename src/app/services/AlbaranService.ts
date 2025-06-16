import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlbaranDTO } from 'src/app/modelo/AlbaranDTO';

@Injectable({
  providedIn: 'root'
})

export class AlbaranService {
  private readonly API_URL = `${environment.apiUrl}/apiAlbaranes`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAlbaranes(): Observable<AlbaranDTO[]> {
    return this.http.get<AlbaranDTO[]>(`${this.API_URL}/todos`, {
      headers: this.getAuthHeaders()
    });
  }

  marcarComoValidado(id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/validar/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  generarFacturaDesdeProveedor(proveedorId: number, inicio: Date, fin: Date): Observable<Blob> {
    const inicioStr = inicio.toISOString().split('T')[0];
    const finStr = fin.toISOString().split('T')[0];
  
    return this.http.get(`${environment.apiUrl}/apiFacturas/generarFactura`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
      params: {
        proveedorId: proveedorId.toString(),
        inicio: inicioStr,
        fin: finStr
      }
    });
  }
  
} 
