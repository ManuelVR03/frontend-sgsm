import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormularioUsuarioPage } from './formulario-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: FormularioUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioUsuarioPageRoutingModule {}
