import { ProveedorDTO } from "./ProveedorDTO";

export interface ProductoDTO {
    id: number;
    nombre: string;
    precioUnitario: number;
    unidadMedida: string;
    proveedor: ProveedorDTO;
}
