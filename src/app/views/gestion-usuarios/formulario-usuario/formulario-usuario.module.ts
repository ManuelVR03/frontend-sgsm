import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioUsuarioPageRoutingModule } from './formulario-usuario-routing.module';

import { FormularioUsuarioPage } from './formulario-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormularioUsuarioPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FormularioUsuarioPage]
})
export class FormularioUsuarioPageModule {}
