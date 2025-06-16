import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionAdministrativaPage } from './gestion-administrativa.page';

const routes: Routes = [
  {
    path: '',
    component: GestionAdministrativaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionAdministrativaPageRoutingModule {}
