import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly API_URL = `${environment.apiUrl}/apiEstadisticas`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getPedidosPorBar(): Observable<any> {
    return this.http.get(`${this.API_URL}/pedidosBar`, {
      headers: this.getAuthHeaders()
    });
  }

  getStockPorProducto(): Observable<any> {
    return this.http.get(`${this.API_URL}/stockPorProducto`, {
      headers: this.getAuthHeaders()
    });
  }

  getPedidosPorMes(): Observable<any> {
    return this.http.get(`${this.API_URL}/pedidosPorMes`, {
      headers: this.getAuthHeaders()
    });
  }
  
  getTopProductosMasPedidos(): Observable<any> {
    return this.http.get(`${this.API_URL}/topProductos`, {
      headers: this.getAuthHeaders()
    });
  }

  exportarEstadisticas(fechaInicio: Date, fechaFin: Date): Observable<Blob> {
    const params = {
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0]
    };
  
    return this.http.get(`${this.API_URL}/exportar`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
      params
    });
  }
  
  
  
}