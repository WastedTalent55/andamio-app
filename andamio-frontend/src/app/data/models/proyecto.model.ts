// data/models/proyecto.model.ts

export interface ItemCotizacion {
  tipo: 'Material' | 'Mano de Obra';
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface Cotizacion {
  version: number;
  items: ItemCotizacion[];
  subtotal: number;
  descuento: number;
  totalObra: number;
  totalNeto: number;
  anticipo: number;
  finiquito: number;
  fechaCreacion: Date;
}

export interface Proyecto {
  id: number;
  clienteId: number;
  nombre: string;
  fechaVisita: string;
  horaVisita?: string;
  direccionVisita: string;
  costoVisita: number;
  estado: 'Cita' | 'Cotizacion' | 'En Progreso' | 'Finalizado' | 'Cancelado' | 'Retrasado';
  cotizaciones?: Cotizacion[]; 
  nombreCliente?: string; 
  telefonoCliente?: string;
  fechaInicioObra?: Date | string;
  horaInicioObra?: string;
  diasEstimados?: number;
  detallesInstalacion?: string;
  fechaCreacion?: Date | string; // Para la fecha de la propuesta
  totalCotizado?: number;
  pagos?: Pago[]; // Historial de abonos
  presupuestoMateriales?: number;
  detallesGastos?: GastoDetalle[];
  gastosReales?: number;
  googleEventId?: string;
}

export interface Pago {
  id: number;
  monto: number;
  fecha: Date | string;
  metodo: 'Efectivo' | 'Transferencia';
  nota?: string;
}

export interface GastoDetalle {
  descripcion: string;
  monto: number;
  fecha: Date;
}