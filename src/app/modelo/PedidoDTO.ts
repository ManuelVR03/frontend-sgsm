export interface PedidoDTO {
    id: number;
    usuarioNombre: string;
    barNombre: string;
    proveedorNombre: string;
    fechaRealizacion: Date;
    fechaRecepcion?: Date;
    estadoPedidoNombre: string;
  }
  