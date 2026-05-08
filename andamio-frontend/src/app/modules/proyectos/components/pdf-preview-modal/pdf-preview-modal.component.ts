import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Proyecto, Cotizacion } from '../../../../data/models/proyecto.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pdf-preview-modal',
  templateUrl: './pdf-preview-modal.component.html',
  styleUrls: ['./pdf-preview-modal.component.scss']
})
export class PdfPreviewModalComponent implements OnInit {
  @Input() proyecto!: Proyecto;
  @Input() cotizacion!: Cotizacion;
  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<void>();

  pdfUrl?: SafeResourceUrl;
  pdfBlob?: Blob;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.generarPdfPreview();
  }

  generarPdfPreview() {
    const doc = new jsPDF();
    
    // Aquí va la misma lógica de diseño que ya tienes para tu PDF
    doc.setFontSize(20);
    doc.text(`Cotizacion: ${this.proyecto.nombre}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Total: $${this.cotizacion.totalNeto}`, 20, 40);
    // ... (puedes copiar tu lógica de jspdf aquí)

    // Convertimos a Blob en lugar de descargar
    this.pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(this.pdfBlob);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  descargarPdf() {
    if (this.pdfBlob) {
      const url = window.URL.createObjectURL(this.pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cotizacion_${this.proyecto.nombre}.pdf`;
      link.click();
    }
  }
}