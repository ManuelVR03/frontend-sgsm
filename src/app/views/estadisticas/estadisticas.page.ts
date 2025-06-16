import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { EstadisticasService } from 'src/app/services/EstadisticasService';
import { ChartData, ChartOptions } from 'chart.js';
import { ExportarEstadisticasPage } from './exportar-estadisticas/exportar-estadisticas.page';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
  standalone: false,
})
export class EstadisticasPage implements OnInit {
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Pedidos por Bar', backgroundColor: '#42A5F5' }]
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: '📦 Pedidos por Bar' },
      legend: { display: true }
    }
  };

  stockChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Stock total', backgroundColor: '#66BB6A' }]
  };
  stockChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      title: { display: true, text: '🔍 Stock total por producto' },
      legend: { display: true }
    }
  };

  pedidosMesChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Pedidos por mes',
      backgroundColor: '#FFA726'
    }]
  };
  pedidosMesChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: '📅 Pedidos por Mes' },
      legend: { display: true }
    }
  };

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4DD0E1', '#AB47BC']
    }]
  };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: '🔥 Top 5 productos más pedidos' },
      legend: { position: 'bottom' }
    }
  };

  constructor(
    private estadisticasService: EstadisticasService,
    private authService: AuthService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.estadisticasService.getPedidosPorBar().subscribe(data => {
      this.barChartData.labels = data.map((d: any) => d.bar);
      this.barChartData.datasets[0].data = data.map((d: any) => d.cantidad);
    });

    this.estadisticasService.getStockPorProducto().subscribe(data => {
      this.stockChartData.labels = data.map((d: any) => d.producto);
      this.stockChartData.datasets[0].data = data.map((d: any) => d.cantidad);
    });

    this.estadisticasService.getPedidosPorMes().subscribe(data => {
      this.pedidosMesChartData.labels = data.map((d: any) => d.mes);
      this.pedidosMesChartData.datasets[0].data = data.map((d: any) => d.cantidad);
    });

    this.estadisticasService.getTopProductosMasPedidos().subscribe(data => {
      this.pieChartData.labels = data.map((d: any) => d.nombre);
      this.pieChartData.datasets[0].data = data.map((d: any) => d.cantidad);
    });
  }

  async exportarEstadisticas() {
    const modal = await this.modalController.create({
      component: ExportarEstadisticasPage,
      cssClass: 'modal-estadisticas'
    });
    
    modal.onDidDismiss().then(async ({ data }) => {
      if (data?.exported) {
        const toast = await this.toastController.create({
          message: 'Estadísticas exportadas correctamente.',
          duration: 3000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
      }
    });
    
    await modal.present();    
  }

  logout() {
    this.authService.logout();
  }
}
