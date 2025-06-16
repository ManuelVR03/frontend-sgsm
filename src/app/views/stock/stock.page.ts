import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { BarDTO } from 'src/app/modelo/BarDTO';
import { BarService } from 'src/app/services/BarService';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
  standalone: false,
})
export class StockPage implements OnInit {

  bares?: BarDTO[]

  constructor(private authService: AuthService,
    private router: Router,
    private barService: BarService
  ) { }

  ngOnInit() {
    this.barService.getBares().subscribe(
      (data: BarDTO[]) => {
        this.bares = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  verStock(barId: number) {
    this.router.navigate(['/stock/stock-bar', barId]);
  }  

  logout() {
    this.authService.logout();
  }
}
