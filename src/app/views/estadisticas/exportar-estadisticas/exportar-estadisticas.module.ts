import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExportarEstadisticasPageRoutingModule } from './exportar-estadisticas-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ExportarEstadisticasPage } from './exportar-estadisticas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExportarEstadisticasPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ExportarEstadisticasPage]
})
export class ExportarEstadisticasPageModule {}
