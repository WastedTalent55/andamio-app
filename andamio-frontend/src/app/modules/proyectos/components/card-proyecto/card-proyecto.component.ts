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
  @Output() verPdf = new EventEmitter<Proyecto>();

  constructor(private pdfService: PdfService) {}

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
}