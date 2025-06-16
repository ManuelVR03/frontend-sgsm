import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoDTO } from 'src/app/modelo/ProductoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly API_URL = `${environment.apiUrl}/apiProductos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getProductos(): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(`${this.API_URL}/producto`, {
      headers: this.getAuthHeaders()
    });
  }

  getProductoById(id: number): Observable<ProductoDTO> {
    return this.http.get<ProductoDTO>(`${this.API_URL}/producto/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  crearProducto(producto: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/producto`, producto, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/producto/${id}`, producto, {
      headers: this.getAuthHeaders()
    });
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/producto/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
