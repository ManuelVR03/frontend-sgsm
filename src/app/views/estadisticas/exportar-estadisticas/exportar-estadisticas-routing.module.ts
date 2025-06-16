import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExportarEstadisticasPage } from './exportar-estadisticas.page';

const routes: Routes = [
  {
    path: '',
    component: ExportarEstadisticasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExportarEstadisticasPageRoutingModule {}
