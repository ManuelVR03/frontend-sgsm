import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarDTO } from '../modelo/BarDTO';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class BarService {
  private readonly API_URL = `${environment.apiUrl}/apiBares`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getBares(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<BarDTO[]>(`${this.API_URL}/bar`, { headers });
  }

  getBarById(barId: number): Observable<BarDTO> {
    return this.http.get<BarDTO>(`${this.API_URL}/bar/${barId}`, {
      headers: this.getAuthHeaders()
    });
  }  
}
