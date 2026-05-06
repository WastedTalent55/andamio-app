export interface Proyecto {
  id: number;
  clienteId: number;
  nombre: string;
  estado: 'Cita' | 'Cotización' | 'En Progreso' | 'Finalizado' | 'Cancelado';
  
  // Datos de la Visita de Evaluación
  fechaVisita: Date;
  direccionVisita: string;
  costoVisita: number;
  
  // Datos de Cotización (Se llenan después)
  costoTotalObra?: number;
  anticipo?: number;
  finiquito?: number;
  fechaInicio?: Date;
  fechaEntregaTentativa?: Date;
  notasLevantamiento?: string;
}

// Manejo de cotizaciones

export interface ItemCotizacion {
  tipo: 'Material' | 'Mano de Obra';
  descripcion: string;
  unidad: string; // m2, litros, servicio, etc.
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
  totalNeto: number; // Ya restando la visita
  anticipo: number;
  finiquito: number;
  fechaCreacion: Date;
}

