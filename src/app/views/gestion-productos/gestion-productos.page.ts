import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { ProductoService } from 'src/app/services/ProductoService';
import { FormularioProductosPage } from './formulario-productos/formulario-productos.page';
import { ProductoDTO } from 'src/app/modelo/ProductoDTO';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.page.html',
  styleUrls: ['./gestion-productos.page.scss'],
  standalone: false,
})
export class GestionProductosPage implements OnInit {
  productosOriginales: ProductoDTO[] = [];
  productosFiltrados: ProductoDTO[] = [];
  terminoBusqueda: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  paginaActual: number = 1;
  tamanoPagina: number = 10;

  constructor(
    private productoService: ProductoService,
    private modalController: ModalController,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        const ordenados = data.sort((a, b) => {
          const proveedorA = a.proveedor?.nombre?.toLowerCase() || '';
          const proveedorB = b.proveedor?.nombre?.toLowerCase() || '';
          if (proveedorA !== proveedorB) return proveedorA.localeCompare(proveedorB);
          return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
        });

        this.productosOriginales = ordenados;
        this.productosFiltrados = [...ordenados];
        this.paginaActual = 1;
      },
      error: () => this.mostrarToast('Error al cargar productos.', 'danger')
    });
  }

  filtrarProductos() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    this.productosFiltrados = this.productosOriginales.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.proveedor?.nombre?.toLowerCase().includes(termino)
    );

    this.paginaActual = 1;
  }

  get productosPaginados(): ProductoDTO[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    const fin = inicio + this.tamanoPagina;
    return this.productosFiltrados.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.tamanoPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  async eliminarProducto(producto: ProductoDTO) {
    const alerta = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Seguro que deseas eliminar el producto <strong>${producto.nombre}</strong>?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.productoService.deleteProducto(producto.id).subscribe({
              next: () => {
                this.mostrarToast(`Producto "${producto.nombre}" eliminado.`);
                this.obtenerProductos();
              },
              error: () => this.mostrarToast('Error al eliminar el producto.', 'danger')
            });
          }
        }
      ]
    });

    await alerta.present();
  }

  ordenarPor(columna: string) {
    if (this.sortColumn === columna) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columna;
      this.sortDirection = 'asc';
    }

    this.productosFiltrados.sort((a: any, b: any) => {
      let valorA = this.obtenerValor(a, columna);
      let valorB = this.obtenerValor(b, columna);

      if (typeof valorA === 'string') valorA = valorA.toLowerCase();
      if (typeof valorB === 'string') valorB = valorB.toLowerCase();

      if (valorA < valorB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valorA > valorB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.paginaActual = 1;
  }

  obtenerValor(obj: any, columna: string): any {
    if (columna === 'proveedor') return obj.proveedor?.nombre ?? '';
    return obj[columna];
  }

  async abrirFormulario(producto: any = null) {
    const modal = await this.modalController.create({
      component: FormularioProductosPage,
      componentProps: { producto }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data?.guardado && data?.datos) {
        const operacion = data.datos.id
          ? this.productoService.actualizarProducto(data.datos.id, data.datos)
          : this.productoService.crearProducto(data.datos);

        operacion.subscribe({
          next: () => {
            this.obtenerProductos();
            this.mostrarToast(producto ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
          },
          error: () => {
            this.mostrarToast('Error al guardar el producto.', 'danger');
          }
        });
      }
    });

    await modal.present();
  }

  logout() {
    this.authService.logout();
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}
