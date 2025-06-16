import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionPedidosPageRoutingModule } from './gestion-pedidos-routing.module';

import { GestionPedidosPage } from './gestion-pedidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionPedidosPageRoutingModule
  ],
  declarations: [GestionPedidosPage]
})
export class GestionPedidosPageModule {}
