export interface UsuarioFormDTO{
    dni: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    telefono?: string;
    correo?: string;
    pass: string;
    rolId: number;
    barId?: number;
  }
  