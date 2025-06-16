import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoDTO } from 'src/app/modelo/ProductoDTO';
import { ProveedorService } from 'src/app/services/ProveedorService';

@Component({
  selector: 'app-formulario-productos',
  templateUrl: './formulario-productos.page.html',
  styleUrls: ['./formulario-productos.page.scss'],
  standalone: false,
})
export class FormularioProductosPage implements OnInit {

  @Input() producto: ProductoDTO = {} as ProductoDTO;

  productoForm!: FormGroup;
  proveedores: any[] = [];

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.cargarProveedores();
  }

  crearFormulario() {
    this.productoForm = this.fb.group({
      nombre: [this.producto?.nombre || '', Validators.required],
      precioUnitario: [this.producto?.precioUnitario || '', [Validators.required, Validators.min(0.01)]],
      unidadMedida: [this.producto?.unidadMedida || '', Validators.required],
      proveedor: [this.producto?.proveedor?.id || null, Validators.required],
    });
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe((data) => {
      this.proveedores = data;
    });
  }

  cancelar() {
    this.modalController.dismiss();
  }

  guardar() {
    if (this.productoForm.invalid) return;
    const formValue = this.productoForm.value;
    this.modalController.dismiss({
      guardado: true,
      datos: {
        id: this.producto?.id ?? null,
        ...formValue,
        proveedor: { id: formValue.proveedor }
      }
    });
  }

}
