import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Proyecto, Cotizacion } from '../../../../data/models/proyecto.model';
import { PdfService } from '../../../../data/services/pdf.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-proyecto',
  imports: [CommonModule, DatePipe],
  templateUrl: './card-proyecto.component.html',
  styleUrl: './card-proyecto.component.scss'
})
export class CardProyectoComponent {
  @Input() proyecto!: Proyecto;
  @Input() cliente: any;
  
  @Output() editar = new EventEmitter<Proyecto>();
  @Output() cancelar = new EventEmitter<Proyecto>();
  @Output() cotizar = new EventEmitter<Proyecto>();
  @Output() agendar = new EventEmitter<Proyecto>();
  @Output() verPdf = new EventEmitter<Proyecto>();
  @Output() proyectoClick = new EventEmitter<Proyecto>();

  constructor(private pdfService: PdfService) {}

  onAgendar() {
    this.agendar.emit(this.proyecto);
  }

  onCotizar() {
    this.cotizar.emit(this.proyecto);
  }

  descargarPDF(event: Event) {
    event.stopPropagation(); // Evita que se abra el detalle
    if (this.proyecto.cotizaciones && this.proyecto.cotizaciones.length > 0) {
      const ultima = this.proyecto.cotizaciones[this.proyecto.cotizaciones.length - 1];
      this.pdfService.generarCotizacionPDF(this.proyecto, ultima);
    }
  }

  verPDF(event: Event) {
    event.stopPropagation(); // Para que no se dispare el click de la tarjeta
    this.verPdf.emit(this.proyecto);
  }

  verDetalle() {
  if (this.proyecto.estado === 'En Progreso') {
    this.proyectoClick.emit(this.proyecto);
  }
}

// Dentro de la clase CardProyectoComponent
// Dentro de la clase CardProyectoComponent en el archivo .ts
get fechaDeLaCotizacion(): any {
  // Entramos a: cotizaciones -> primer elemento (0) -> fechaCreacion
  if (this.proyecto.cotizaciones && this.proyecto.cotizaciones.length > 0) {
    return this.proyecto.cotizaciones[0].fechaCreacion;
  }
  // Si no hay cotización aún, regresamos la fecha de visita para que no se vea vacío
  return this.proyecto.fechaVisita;
}

get montoMostrar(): number {
  // 1. Si está en cita, el monto es el costo de visita
  if (this.proyecto.estado === 'Cita') {
    return this.proyecto.costoVisita;
  }

  // 2. Si está en Cotización o En Obra, buscamos el total en la cotización
  if (this.proyecto.cotizaciones && this.proyecto.cotizaciones.length > 0) {
    // Sacamos el totalObra de la primera cotización
    return this.proyecto.cotizaciones[0].totalObra || 0;
  }

  return 0;
}
}