import { DetalleProductoDTO } from "./DetalleProductoDTO";

export interface NuevoPedidoDTO {

  barId: number;
  usuarioId: number;
  proveedorId: number;
  productos: DetalleProductoDTO[];

}