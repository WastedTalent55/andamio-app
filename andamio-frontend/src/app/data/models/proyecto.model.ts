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
  estado: 'Cita' | 'Cotizacion' | 'En Progreso' | 'Finalizado' | 'Cancelado';
  cotizaciones?: Cotizacion[]; 
  nombreCliente?: string; 
  telefonoCliente?: string;
  fechaInicioObra?: string;
  horaInicioObra?: string;
  detallesInstalacion?: string;
  fechaCreacion?: Date | string; // Para la fecha de la propuesta
  totalCotizado?: number;
  googleEventId?: string;
}