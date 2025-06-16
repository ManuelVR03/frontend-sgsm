import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/UsuarioService';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { FormularioUsuarioPage } from './formulario-usuario/formulario-usuario.page';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.page.html',
  styleUrls: ['./gestion-usuarios.page.scss'],
  standalone: false
})
export class GestionUsuariosPage implements OnInit {
  usuarios: UsuarioDTO[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private modalController: ModalController,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: () => this.mostrarToast('Error al cargar usuarios.', 'danger')
    });
  }

  async eliminarUsuario(usuario: UsuarioDTO) {
    const alerta = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Seguro que deseas eliminar al usuario <strong>${usuario.nombre}</strong>?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.usuarioService.deleteUsuario(usuario.id).subscribe({
              next: () => {
                this.obtenerUsuarios();
                this.mostrarToast(`Usuario "${usuario.nombre}" eliminado.`);
              },
              error: () => this.mostrarToast('Error al eliminar el usuario.', 'danger')
            });
          }
        }
      ]
    });

    await alerta.present();
  }

  async abrirFormulario(usuario: any = null) {
    const modal = await this.modalController.create({
      component: FormularioUsuarioPage,
      componentProps: {
        usuario: usuario
      }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data?.guardado) {
        const usuarioData = data.datos;

        const operacion = usuarioData.id
          ? this.usuarioService.actualizarUsuario(usuarioData.id, usuarioData)
          : this.usuarioService.crearUsuario(usuarioData);

        operacion.subscribe({
          next: () => {
            this.obtenerUsuarios();
            this.mostrarToast(usuarioData.id
              ? 'Usuario actualizado correctamente.'
              : 'Usuario creado correctamente.');
          },
          error: () => this.mostrarToast('Error al guardar el usuario.', 'danger')
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
