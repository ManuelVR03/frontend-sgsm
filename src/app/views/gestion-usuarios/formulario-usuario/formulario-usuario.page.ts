import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolService } from 'src/app/services/RolService';
import { BarService } from 'src/app/services/BarService';
import { validateDniControl } from 'src/app/utils/form.utils';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.page.html',
  styleUrls: ['./formulario-usuario.page.scss'],
  standalone: false
})
export class FormularioUsuarioPage implements OnInit {
  @Input() usuario: UsuarioDTO = {} as UsuarioDTO;


  usuarioForm!: FormGroup;
  roles: any[] = [];
  bares: any[] = [];
  deshabilitarRol: boolean = false;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private rolService: RolService,
    private barService: BarService
  ) { }

  ngOnInit() {
    this.deshabilitarRol =
    this.usuario?.id === this.usuario?.id &&
    this.usuario?.rol?.nombre === 'Administrador';
    this.cargaDatos();
    this.crearFormulario();
  }

  crearFormulario() {
    this.usuarioForm = this.fb.group({
      dni: [this.usuario?.dni || '', [Validators.required, validateDniControl]],
      nombre: [this.usuario?.nombre || '', Validators.required],
      apellido1: [this.usuario?.apellido1 || '', Validators.required],
      apellido2: [this.usuario?.apellido2 || '', Validators.required],
      pass: [''],
      rol: [this.usuario?.rol?.id || null, Validators.required],
      bar: [this.usuario?.bar?.id || null]
    });
  }

  cargaDatos() {
    this.rolService.getRoles().subscribe((data) => {
      this.roles = data;
    });
    
    this.barService.getBares().subscribe((data) => {
      this.bares = data;
    });
  }

  cancelar() {
    this.modalController.dismiss();
  }

  guardar() {
    if (this.usuarioForm.invalid) return;
  
    const formValue = this.usuarioForm.value;
  
    this.modalController.dismiss({
      guardado: true,
      datos: {
        id: this.usuario?.id ?? null,
        ...formValue,
        rol: { id: formValue.rol },
        bar: formValue.bar ? { id: formValue.bar } : null
      }
    });
  }
  
  
}
