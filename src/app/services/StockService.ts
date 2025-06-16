import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StockDTO } from 'src/app/modelo/StockDTO';

@Injectable({
  providedIn: 'root'
})

export class StockService {
  private readonly API_URL = `${environment.apiUrl}/apiStock`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getStockByBarId(barId: number): Observable<StockDTO[]> {
    return this.http.get<StockDTO[]>(`${this.API_URL}/bar/${barId}`, {
        headers: this.getAuthHeaders()
    })
  }

  actualizarLoteStock(stockModificado: StockDTO[]): Observable<any> {
    return this.http.put(`${this.API_URL}/modificar`, stockModificado, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }  
  
}
