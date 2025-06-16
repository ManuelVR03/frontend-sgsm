import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockBarPage } from './stock-bar.page';

const routes: Routes = [
  {
    path: '',
    component: StockBarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockBarPageRoutingModule {}
