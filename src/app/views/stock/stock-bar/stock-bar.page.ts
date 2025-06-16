import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockService } from 'src/app/services/StockService';
import { StockDTO } from 'src/app/modelo/StockDTO';
import { AuthService } from 'src/app/services/AuthService';
import { BarService } from 'src/app/services/BarService';
import { BarDTO } from 'src/app/modelo/BarDTO';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-stock-bar',
  templateUrl: './stock-bar.page.html',
  styleUrls: ['./stock-bar.page.scss'],
  standalone: false
})
export class StockBarPage implements OnInit {

  stock: StockDTO[] = [];
  stockOriginal: StockDTO[] = [];
  stockFiltrado: StockDTO[] = [];
  filtro: string = '';

  barId!: number;
  barNombre: string = '';

  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private authService: AuthService,
    private barService: BarService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.barId = +params.get('barId')!;
      this.cargarStock();
      this.cargarBar();
    });
  }

  cargarStock() {
    this.stockService.getStockByBarId(this.barId).subscribe(
      data => {
        this.stock = data.filter(item => item.cantidad > 0);
        this.stockOriginal = JSON.parse(JSON.stringify(this.stock));
        this.filtrarStock();
      },
      error => console.error('Error al cargar stock:', error)
    );
  }

  cargarBar() {
    this.barService.getBarById(this.barId).subscribe(
      (bar: BarDTO) => this.barNombre = bar.nombre,
      error => console.error('Error al obtener nombre del bar:', error)
    );
  }

  filtrarStock() {
    const filtroNormalizado = this.filtro.toLowerCase().trim();
    this.stockFiltrado = this.stock.filter(item =>
      item.productoNombre.toLowerCase().includes(filtroNormalizado)
    );
  }

  async abrirDisminuir(item: StockDTO) {
    const alert = await this.alertController.create({
      header: `Disminuir stock`,
      subHeader: item.productoNombre,
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          min: 1,
          placeholder: 'Cantidad a restar'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aceptar',
          handler: (data) => {
            const cantidad = parseFloat(data.cantidad);
            if (!isNaN(cantidad) && cantidad > 0 && cantidad <= item.cantidad) {
              item.cantidad -= cantidad;
              this.filtrarStock();
            } else {
              this.mostrarError('Cantidad inválida o mayor que el stock actual.');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarCambios() {
    const cambios = this.stock.filter((item, index) =>
      item.cantidad !== this.stockOriginal[index].cantidad
    );

    if (cambios.length === 0) {
      this.mostrarError('No has modificado ninguna cantidad.');
      return;
    }

    const resumen = cambios.map(item => {
      const original = this.stockOriginal.find(o => o.productoNombre === item.productoNombre);
      return `${item.productoNombre}:\n  ${original?.cantidad} → ${item.cantidad}`;
    }).join('\n\n');

    const alert = await this.alertController.create({
      header: 'Confirmar cambios',
      message: `Se van a modificar las siguientes cantidades:\n\n${resumen}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.stock = JSON.parse(JSON.stringify(this.stockOriginal));
            this.filtrarStock();
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.stockService.actualizarLoteStock(cambios).subscribe({
              next: () => this.mostrarInfo('Los cambios se han guardado correctamente.'),
              error: (err) => {
                console.error('Error al guardar cambios:', err);
                this.mostrarError('Hubo un error al actualizar el stock.');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarError(msg: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarInfo(msg: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: msg,
      buttons: [{
        text: 'OK',
        handler: () => this.cargarStock()
      }]
    });
    await alert.present();
  }

  logout() {
    this.authService.logout();
  }
}
