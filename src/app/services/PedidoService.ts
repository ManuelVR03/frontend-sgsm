import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BarDTO } from '../modelo/BarDTO';
import { ProveedorDTO } from '../modelo/ProveedorDTO';
import { ProductoDTO } from '../modelo/ProductoDTO';
import { NuevoPedidoDTO } from '../modelo/NuevoPedidoDTO';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly API_URL = `${environment.apiUrl}/apiPedidos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getBares(): Observable<BarDTO[]> {
    return this.http.get<BarDTO[]>(`${environment.apiUrl}/apiBares/bar`, {
      headers: this.getAuthHeaders()
    });
  }

  getProveedores(): Observable<ProveedorDTO[]> {
    return this.http.get<ProveedorDTO[]>(`${environment.apiUrl}/apiProveedores/proveedor`, {
      headers: this.getAuthHeaders()
    });
  }

  getProductosPorProveedor(proveedorId: number): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(
      `${environment.apiUrl}/apiProductos/proveedor/${proveedorId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  crearPedido(data: NuevoPedidoDTO): Observable<any> {
    return this.http.post(`${this.API_URL}/crearPedido`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getTodosLosPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/todos`, {
      headers: this.getAuthHeaders()
    });
  }
  
  marcarPedidoComoRecibido(pedidoId: number): Observable<any> {
    return this.http.put(`${this.API_URL}/recibido/${pedidoId}`, null, {
      headers: this.getAuthHeaders()
    });
  }

  getPedidosPorBar(barId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/bar/${barId}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  
}
