import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolDTO } from '../modelo/RolDTO';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly API_URL = `${environment.apiUrl}/apiRoles`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<RolDTO[]>(`${this.API_URL}/rol`, { headers });
  }
}
