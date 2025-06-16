import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionPedidosPage } from './gestion-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionPedidosPage
  },
  {
    path: 'nuevo-pedido',
    loadChildren: () => import('./nuevo-pedido/nuevo-pedido.module').then( m => m.NuevoPedidoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionPedidosPageRoutingModule {}
