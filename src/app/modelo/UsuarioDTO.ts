import { BarDTO } from "./BarDTO";
import { RolDTO } from "./RolDTO";

export interface UsuarioDTO {
    id: number;
    dni: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    pass: string;
    rol: RolDTO;
    bar: BarDTO | null;
  }
  