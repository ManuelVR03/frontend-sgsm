import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {
  rol: string | null = null;

  cards = [
    { nombre: 'Gestión Administrativa', rol: 'Administrativa', icono: 'cash-outline', color: '#90CAF9', ruta: '/gestion-administrativa' },
    { nombre: 'Gestión de Usuarios', rol: 'Administrador', icono: 'person', color: '#A5D6A7', ruta: '/gestion-usuarios' },
    { nombre: 'Gestión de Productos', rol: 'Administrador', icono: 'pricetags-outline', color: '#FFE082', ruta: '/gestion-productos' },
    { nombre: 'Estadísticas', rol: 'Administrador', icono: 'stats-chart-outline', color: '#CE93D8', ruta: '/estadisticas' },
    { nombre: 'Pedidos', rol: 'Camarero', icono: 'receipt-outline', color: '#FFAB91', ruta: '/gestion-pedidos' },
    { nombre: 'Stock', rol: 'Camarero', icono: 'storefront-outline', color: '#B39DDB', ruta: null }
  ];  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.rol = this.authService.getRol();
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  canAccess(requiredRole: string): boolean {
    if (!this.rol) return false;
    if (this.rol === 'Administrador') return true;
  
    if (this.rol === 'Administrativa') {
      return requiredRole === 'Administrativa';
    }
  
    if (
      ['Camarero', 'Cocinero', 'Encargado_Camareros', 'Encargado_Cocineros'].includes(this.rol)
    ) {
      return ['Camarero', 'Cocinero'].includes(requiredRole);
    }
  
    return false;
  }  

  get visibleCards() {
    return this.cards.filter(card => this.canAccess(card.rol));
  }  

  logout() {
    this.authService.logout();
  }
  
  navegar(card: any) {
    if (card.nombre === 'Stock') {
      const { rolNombre, barId } = this.authService.getUsuarioActual();
      if ((rolNombre === 'Camarero' || rolNombre === 'Cocinero') && barId) {
        this.router.navigate([`/stock/stock-bar/${barId}`]);
      } else {
        this.router.navigate(['/stock']);
      }
    } else if (card.ruta) {
      this.router.navigate([card.ruta]);
    }
  }
  
}
