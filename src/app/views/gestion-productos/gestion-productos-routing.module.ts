import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionProductosPage } from './gestion-productos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionProductosPage
  },
  {
    path: 'formulario-productos',
    loadChildren: () => import('./formulario-productos/formulario-productos.module').then( m => m.FormularioProductosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionProductosPageRoutingModule {}
