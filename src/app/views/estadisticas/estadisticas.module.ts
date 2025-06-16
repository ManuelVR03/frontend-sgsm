import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadisticasPageRoutingModule } from './estadisticas-routing.module';
import { NgChartsModule } from 'ng2-charts';

import { EstadisticasPage } from './estadisticas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadisticasPageRoutingModule,
    NgChartsModule
  ],
  declarations: [EstadisticasPage]
})
export class EstadisticasPageModule {}
