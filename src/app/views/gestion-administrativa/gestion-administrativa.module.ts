import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionAdministrativaPageRoutingModule } from './gestion-administrativa-routing.module';

import { GestionAdministrativaPage } from './gestion-administrativa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionAdministrativaPageRoutingModule
  ],
  declarations: [GestionAdministrativaPage]
})
export class GestionAdministrativaPageModule {}
