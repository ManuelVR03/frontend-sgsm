import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { AlbaranService } from 'src/app/services/AlbaranService';
import { AlbaranDTO } from 'src/app/modelo/AlbaranDTO';
import { ProveedorDTO } from 'src/app/modelo/ProveedorDTO';
import { saveAs } from 'file-saver';
import { PdfService } from 'src/app/services/PdfService';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-gestion-administrativa',
  templateUrl: './gestion-administrativa.page.html',
  styleUrls: ['./gestion-administrativa.page.scss'],
  standalone: false,
})
export class GestionAdministrativaPage implements OnInit {
  aniosDisponibles: number[] = [];
  mesesDisponibles = [
    { nombre: 'Enero', valor: 1 }, { nombre: 'Febrero', valor: 2 },
    { nombre: 'Marzo', valor: 3 }, { nombre: 'Abril', valor: 4 },
    { nombre: 'Mayo', valor: 5 }, { nombre: 'Junio', valor: 6 },
    { nombre: 'Julio', valor: 7 }, { nombre: 'Agosto', valor: 8 },
    { nombre: 'Septiembre', valor: 9 }, { nombre: 'Octubre', valor: 10 },
    { nombre: 'Noviembre', valor: 11 }, { nombre: 'Diciembre', valor: 12 },
  ];

  anioSeleccionado: number | null = null;
  mesSeleccionado: number | null = null;
  proveedorSeleccionado: number | null = null;
  estadoSeleccionado: 'pendientes' | 'validados' = 'pendientes';

  cargando = false;

  albaranesPorProveedor: Map<string, AlbaranDTO[]> = new Map();
  proveedores: ProveedorDTO[] = [];
  albaranesFiltrados: AlbaranDTO[] = [];

  constructor(
    private authService: AuthService,
    private albaranService: AlbaranService,
    private pdfService: PdfService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const anioActual = new Date().getFullYear();
    this.aniosDisponibles = Array.from({ length: 6 }, (_, i) => anioActual - i);
  }

  onPeriodoChange() {
    if (this.anioSeleccionado && this.mesSeleccionado) {
      const inicio = new Date(this.anioSeleccionado, this.mesSeleccionado - 1, 1);
      const fin = new Date(this.anioSeleccionado, this.mesSeleccionado, 0);

      this.cargando = true;

      this.albaranService.getAlbaranes().subscribe({
        next: (data) => {
          this.albaranesPorProveedor.clear();
          const proveedorMap = new Map<number, ProveedorDTO>();

          const albaranesPeriodo = data.filter((a) => {
            const fecha = new Date(a.fechaGeneracion);
            return fecha >= inicio && fecha <= fin;
          });

          albaranesPeriodo.forEach((albaran) => {
            const proveedorId = albaran.proveedorId;
            const proveedorNombre = albaran.proveedorNombre;

            if (!proveedorMap.has(proveedorId)) {
              proveedorMap.set(proveedorId, { id: proveedorId, nombre: proveedorNombre });
            }

            const key = proveedorId.toString();
            if (!this.albaranesPorProveedor.has(key)) {
              this.albaranesPorProveedor.set(key, []);
            }

            this.albaranesPorProveedor.get(key)!.push(albaran);
          });

          this.proveedores = Array.from(proveedorMap.values());
          this.proveedorSeleccionado = null;
          this.albaranesFiltrados = [];
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar albaranes', err);
          this.mostrarToast('Error al cargar albaranes', 'danger');
          this.cargando = false;
        }
      });
    }
  }

  filtrarAlbaranes() {
    const todos = this.albaranesPorProveedor.get(this.proveedorSeleccionado?.toString() || '') || [];

    this.albaranesFiltrados = todos.filter(a => {
      return this.estadoSeleccionado === 'pendientes' ? !a.validado : a.validado;
    });
  }

  descargarPDF(albaran: AlbaranDTO) {
    this.pdfService.generarAlbaranPDF(albaran);
  }

  generarFacturaMensual() {
    if (!this.anioSeleccionado || !this.mesSeleccionado || !this.proveedorSeleccionado) {
      this.mostrarToast('Debes seleccionar año, mes y proveedor.', 'danger');
      return;
    }

    const inicio = new Date(this.anioSeleccionado, this.mesSeleccionado - 1, 1);
    const fin = new Date(this.anioSeleccionado, this.mesSeleccionado, 0);

    this.cargando = true;

    this.albaranService.generarFacturaDesdeProveedor(this.proveedorSeleccionado, inicio, fin).subscribe({
      next: (blob) => {
        saveAs(blob, `factura-${this.proveedorSeleccionado}.pdf`);
        this.onPeriodoChange();
        this.mostrarToast('Factura generada y enviada al proveedor.');
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al generar factura', err);
        this.mostrarToast('Error al generar la factura.', 'danger');
        this.cargando = false;
      }
    });
  }

  async mostrarToast(mensaje: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  logout() {
    this.authService.logout();
  }
}
