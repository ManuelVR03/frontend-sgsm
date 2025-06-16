import { Component, OnInit } from '@angular/core';
import { PedidoDTO } from 'src/app/modelo/PedidoDTO';
import { PedidoService } from 'src/app/services/PedidoService';
import { AuthService } from 'src/app/services/AuthService';
import { ModalController, ToastController } from '@ionic/angular';
import { NuevoPedidoPage } from './nuevo-pedido/nuevo-pedido.page';

@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.page.html',
  styleUrls: ['./gestion-pedidos.page.scss'],
  standalone: false,
})
export class GestionPedidosPage implements OnInit {
  pedidos: PedidoDTO[] = [];
  esAdmin: boolean = false;
  barNombre: string = '';
  usuarioRol: string = '';
  barIdUsuario: number | null = null;

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const user = this.authService.getUsuarioActual();
    this.usuarioRol = user?.rolNombre || '';
    this.barIdUsuario = user?.barId || null;
    this.esAdmin = this.usuarioRol === 'Administrador';

    if (this.usuarioRol === 'Camarero' || this.usuarioRol === 'Cocinero') {
      this.obtenerPedidosPorBar(this.barIdUsuario!);
    } else {
      this.obtenerTodosLosPedidos();
    }
  }

  obtenerTodosLosPedidos() {
    this.pedidoService.getTodosLosPedidos().subscribe({
      next: data => this.pedidos = data,
      error: () => this.mostrarToast('Error al cargar pedidos.', 'danger')
    });
  }

  obtenerPedidosPorBar(barId: number) {
    this.pedidoService.getPedidosPorBar(barId).subscribe({
      next: data => this.pedidos = data,
      error: () => this.mostrarToast('Error al cargar pedidos del bar.', 'danger')
    });
  }

  marcarRecibido(pedido: PedidoDTO) {
    this.pedidoService.marcarPedidoComoRecibido(pedido.id).subscribe({
      next: () => {
        pedido.estadoPedidoNombre = 'Entregado';
        pedido.fechaRecepcion = new Date();
        this.mostrarToast('Pedido marcado como recibido.');
      },
      error: (err) => {
        console.error('Error al marcar como recibido:', err);
        this.mostrarToast('Error al marcar el pedido como recibido.', 'danger');
      }
    });
  }

  async abrirFormularioPedido() {
    const modal = await this.modalController.create({
      component: NuevoPedidoPage,
      componentProps: {
        barId: this.barIdUsuario ?? null
      }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data?.guardado) {
        if (this.usuarioRol === 'Camarero' || this.usuarioRol === 'Cocinero') {
          this.obtenerPedidosPorBar(this.barIdUsuario!);
        } else {
          this.obtenerTodosLosPedidos();
        }
        this.mostrarToast('Pedido creado correctamente.');
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
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}
