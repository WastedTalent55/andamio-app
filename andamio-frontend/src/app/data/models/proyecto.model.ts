export interface Proyecto {
  id: number;
  clienteId: number;
  nombre: string;
  estado: 'Cita' | 'Cotización' | 'En Progreso' | 'Finalizado';
  
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