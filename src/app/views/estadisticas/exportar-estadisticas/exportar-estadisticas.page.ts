import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadisticasService } from 'src/app/services/EstadisticasService';

@Component({
  selector: 'app-exportar-estadisticas',
  templateUrl: './exportar-estadisticas.page.html',
  styleUrls: ['./exportar-estadisticas.page.scss'],
  standalone: false,
})
export class ExportarEstadisticasPage implements OnInit {
  formPeriodo!: FormGroup;

  periodos = ['Mensual', 'Trimestral', 'Semestral', 'Anual'];
  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  trimestres = ['Primer', 'Segundo', 'Tercero', 'Cuarto'];
  semestres = ['Primero', 'Segundo'];
  anios: number[] = [];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private estadisticasService: EstadisticasService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const añoActual = new Date().getFullYear();
    for (let i = añoActual - 10; i <= añoActual; i++) {
      this.anios.push(i);
    }

    this.formPeriodo = this.fb.group({
      periodo: ['', Validators.required],
      mes: [''],
      trimestre: [''],
      semestre: [''],
      anio: [añoActual, Validators.required]
    });

    this.formPeriodo.get('periodo')!.valueChanges.subscribe(valor => {
      this.resetOpcionales();

      if (valor === 'Mensual') {
        this.formPeriodo.get('mes')!.setValidators(Validators.required);
      } else if (valor === 'Trimestral') {
        this.formPeriodo.get('trimestre')!.setValidators(Validators.required);
      } else if (valor === 'Semestral') {
        this.formPeriodo.get('semestre')!.setValidators(Validators.required);
      }

      this.formPeriodo.get('mes')!.updateValueAndValidity();
      this.formPeriodo.get('trimestre')!.updateValueAndValidity();
      this.formPeriodo.get('semestre')!.updateValueAndValidity();
    });
  }

  private resetOpcionales(): void {
    this.formPeriodo.get('mes')!.clearValidators();
    this.formPeriodo.get('trimestre')!.clearValidators();
    this.formPeriodo.get('semestre')!.clearValidators();

    this.formPeriodo.get('mes')!.setValue('');
    this.formPeriodo.get('trimestre')!.setValue('');
    this.formPeriodo.get('semestre')!.setValue('');
  }

  cancelar() {
    this.modalController.dismiss();
  }

  exportar() {
    if (this.formPeriodo.invalid) {
      this.mostrarToast('Debes completar los campos requeridos.', 'danger');
      return;
    }

    const form = this.formPeriodo.value;
    let fechaInicio: Date;
    let fechaFin: Date;

    try {
      switch (form.periodo) {
        case 'Mensual':
          const mesIndex = this.meses.indexOf(form.mes);
          fechaInicio = new Date(form.anio, mesIndex, 1);
          fechaFin = new Date(form.anio, mesIndex + 1, 0);
          break;
        case 'Trimestral':
          const t = this.trimestres.indexOf(form.trimestre);
          fechaInicio = new Date(form.anio, t * 3, 1);
          fechaFin = new Date(form.anio, (t + 1) * 3, 0);
          break;
        case 'Semestral':
          const s = form.semestre === 'Primero' ? 0 : 6;
          fechaInicio = new Date(form.anio, s, 1);
          fechaFin = new Date(form.anio, s + 6, 0);
          break;
        case 'Anual':
          fechaInicio = new Date(form.anio, 0, 1);
          fechaFin = new Date(form.anio, 11, 31);
          break;
        default:
          this.mostrarToast('Periodo no válido.', 'danger');
          return;
      }
    } catch (e) {
      this.mostrarToast('Error calculando las fechas.', 'danger');
      return;
    }

    this.estadisticasService.exportarEstadisticas(fechaInicio, fechaFin).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `estadisticas_${form.periodo}_${form.anio}.ods`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.modalController.dismiss({ exported: true });
        this.mostrarToast('Estadísticas exportadas correctamente.');
      },
      error: (err) => {
        console.error('Error exportando ODS:', err);
        this.mostrarToast('Error al exportar estadísticas.', 'danger');
      }
    });
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
