import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthRoleGuard } from './guards/AuthRoleGuard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'gestion-usuarios',
    loadChildren: () => import('./views/gestion-usuarios/gestion-usuarios.module').then( m => m.GestionUsuariosPageModule),
    canActivate: [AuthRoleGuard],
    data: { roles: ['Administrador'] }
  },
  {
    path: 'gestion-productos',
    loadChildren: () => import('./views/gestion-productos/gestion-productos.module').then( m => m.GestionProductosPageModule),
    canActivate: [AuthRoleGuard],
    data: { roles: ['Administrador'] }
  },
  {
    path: 'gestion-administrativa',
    loadChildren: () => import('./views/gestion-administrativa/gestion-administrativa.module').then( m => m.GestionAdministrativaPageModule),
    canActivate: [AuthRoleGuard],
    data: { roles: ['Administrador', 'Administrativa'] }
  },
  {
    path: 'gestion-pedidos',
    loadChildren: () => import('./views/gestion-pedidos/gestion-pedidos.module').then( m => m.GestionPedidosPageModule),
    canActivate: [AuthRoleGuard],
    data: { roles: ['Administrador', 'Camarero', 'Cocinero', 'Encargado_Camareros', 'Encargado_Cocineros'] }
  },
  {
    path: 'stock',
    loadChildren: () => import('./views/stock/stock.module').then( m => m.StockPageModule),
    canActivate: [AuthRoleGuard],
    data: { roles: ['Administrador', 'Camarero', 'Cocinero', 'Encargado_Camareros', 'Encargado_Cocineros'] }
  },  
  {
    path: 'inicio',
    loadChildren: () => import('./views/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('./views/estadisticas/estadisticas.module').then( m => m.EstadisticasPageModule),
    canActivate: [AuthRoleGuard],
    data: { roles: ['Administrador'] }
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
