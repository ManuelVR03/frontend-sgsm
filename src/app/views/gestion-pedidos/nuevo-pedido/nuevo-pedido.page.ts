import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PedidoService } from 'src/app/services/PedidoService';
import { BarDTO } from 'src/app/modelo/BarDTO';
import { ProveedorDTO } from 'src/app/modelo/ProveedorDTO';
import { ProductoDTO } from 'src/app/modelo/ProductoDTO';
import { NuevoPedidoDTO } from 'src/app/modelo/NuevoPedidoDTO';

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.page.html',
  styleUrls: ['./nuevo-pedido.page.scss'],
  standalone: false,
})
export class NuevoPedidoPage implements OnInit {
  pedidoForm!: FormGroup;

  bares: BarDTO[] = [];
  proveedores: ProveedorDTO[] = [];
  productos: ProductoDTO[] = [];

  usuarioId: number = 0;
  isAdmin: boolean = false;
  barNombre: string = '';

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    const rol = localStorage.getItem('rol');
    this.usuarioId = Number(localStorage.getItem('idUsuario'));
    this.isAdmin = rol === 'Administrador';

    this.pedidoForm = this.fb.group({
      barId: ['', Validators.required],
      proveedorId: ['', Validators.required],
      productos: this.fb.array([])
    });

    if (this.isAdmin) {
      this.pedidoService.getBares().subscribe(b => this.bares = b);
    } else {
      const barId = Number(localStorage.getItem('barId'));
      this.pedidoForm.get('barId')?.setValue(barId);
      this.pedidoService.getBares().subscribe(b => {
        const bar = b.find(bar => bar.id === barId);
        this.barNombre = bar?.nombre || 'Bar asignado';
      });
    }

    this.pedidoService.getProveedores().subscribe(p => this.proveedores = p);
  }

  get productosFormArray(): FormArray {
    return this.pedidoForm.get('productos') as FormArray;
  }

  cargarProductos() {
    const proveedorId = this.pedidoForm.get('proveedorId')?.value;
    if (!proveedorId) return;

    this.pedidoService.getProductosPorProveedor(proveedorId).subscribe(data => {
      this.productos = data;
      this.productosFormArray.clear();

      data.forEach(prod => {
        this.productosFormArray.push(
          this.fb.group({
            productoId: [prod.id],
            cantidad: [0]
          })
        );
      });
    });
  }

  hayAlMenosUnProductoConCantidad(): boolean {
    return this.productosFormArray.controls.some(control =>
      control.get('cantidad')?.value > 0
    );
  }

  enviarPedido() {
    if (this.pedidoForm.invalid) {
      alert('Completa todos los campos requeridos correctamente.');
      return;
    }

    const formValue = this.pedidoForm.value;
    const productosValidos = formValue.productos.filter((p: any) => p.cantidad > 0);

    if (productosValidos.length === 0) {
      alert('Debes indicar al menos un producto con cantidad mayor que cero.');
      return;
    }

    const pedido: NuevoPedidoDTO = {
      barId: formValue.barId,
      usuarioId: this.usuarioId,
      proveedorId: formValue.proveedorId,
      productos: productosValidos
    };

    this.pedidoService.crearPedido(pedido).subscribe({
      next: () => this.modalController.dismiss({ guardado: true }),
      error: (err) => {
        console.error('Error real del backend:', err);
        alert('Error al crear el pedido.');
      }
    });
  }

  cancelar() {
    this.modalController.dismiss();
  }
}
