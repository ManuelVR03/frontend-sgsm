import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth/login`;
  private rolSubject = new BehaviorSubject<string | null>(null);
  rol$ = this.rolSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { dni: string; pass: string }) {
    return this.http.post<any>(this.API_URL, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('rol', response.rol.replace(/\[|\]/g, ''));
        localStorage.setItem('idUsuario', response.idUsuario.toString());

        if (response.barId !== undefined && response.barId !== null) {
          localStorage.setItem('barId', response.barId.toString());
        } else {
          localStorage.removeItem('barId');
        }

        this.rolSubject.next(response.rol);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('barId');
    this.rolSubject.next(null);
    this.router.navigate(['/home']);
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsuarioActual(): {
    rolNombre: string | null;
    idUsuario: number | null;
    barId: number | null;
  } {
    const rolNombre = localStorage.getItem('rol');
    const idUsuario = localStorage.getItem('idUsuario');
    const barId = localStorage.getItem('barId');

    return {
      rolNombre,
      idUsuario: idUsuario ? parseInt(idUsuario, 10) : null,
      barId: barId ? parseInt(barId, 10) : null
    };
  }
}
