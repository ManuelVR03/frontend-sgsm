import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FormularioProductosPageRoutingModule } from './formulario-productos-routing.module';

import { FormularioProductosPage } from './formulario-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormularioProductosPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FormularioProductosPage]
})
export class FormularioProductosPageModule {}
