import { AlbaranProductoDTO } from './AlbaranProductoDTO';

export interface AlbaranDTO {
  id: number;
  fechaGeneracion: Date;
  importeTotal: number;
  validado: boolean;
  proveedorId: number;
  proveedorNombre: string;
  proveedorCif: string;
  proveedorDireccion: string;
  proveedorTelefono: string;
  proveedorEmail: string;
  clienteNombre: string;
  clienteDireccion: string;
  clienteNif: string;
  pedidoId: number;
  productos: AlbaranProductoDTO[];
}
