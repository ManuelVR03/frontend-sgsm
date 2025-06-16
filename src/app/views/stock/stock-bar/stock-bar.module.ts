import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockBarPageRoutingModule } from './stock-bar-routing.module';

import { StockBarPage } from './stock-bar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockBarPageRoutingModule
  ],
  declarations: [StockBarPage]
})
export class StockBarPageModule {}
