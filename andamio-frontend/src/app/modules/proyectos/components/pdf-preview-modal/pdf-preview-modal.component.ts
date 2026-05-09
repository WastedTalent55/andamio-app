import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Proyecto, Cotizacion } from '../../../../data/models/proyecto.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

@Component({
  selector: 'app-pdf-preview-modal',
  standalone: true,
  templateUrl: './pdf-preview-modal.component.html',
  styleUrls: ['./pdf-preview-modal.component.scss']
})

export class PdfPreviewModalComponent implements OnInit {
  @Input() proyecto!: Proyecto;
  @Input() cotizacion!: Cotizacion;
  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<Cotizacion>();

  pdfUrl?: SafeResourceUrl;
  pdfBlob?: Blob;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.generarPdfPreview();
  }

  generarPdfPreview() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // 1. TÍTULO Y LÍNEA
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(100, 150, 50);
    doc.text("Cotización", 20, 30);
    doc.setDrawColor(100, 150, 50);
    doc.setLineWidth(0.5);
    doc.line(20, 35, pageWidth - 20, 35);

    // 2. BLOQUE CLIENTE (Compacto)
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENTX:", 20, 42);
    doc.text("DIRECCIÓN:", 20, 48);
    doc.text("TELÉFONO:", 20, 54);
    doc.setFont("helvetica", "normal");
    doc.text(`${this.proyecto.nombreCliente || 'Cliente'}`, 45, 42); 
    doc.text(`${this.proyecto.direccionVisita || 'Sin dirección'}`, 45, 48);
    doc.text(`${this.proyecto.telefonoCliente || 'Sin teléfono'}`, 45, 54);

    doc.setFont("helvetica", "bold");
    doc.text("FECHA:", pageWidth - 70, 48); 
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date().toLocaleDateString()}`, pageWidth - 45, 48);

    // 3. TABLA DE MANO DE OBRA
    const bodyManoObra: any[] = [
      [{ content: 'MANO DE OBRA', colSpan: 5, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }],
      ...this.cotizacion.items.filter(i => i.tipo === 'Mano de Obra').map(i => [
        i.descripcion, `$${i.precioUnitario.toLocaleString()}`, i.cantidad, i.unidad, `$${(i.cantidad * i.precioUnitario).toLocaleString()}`
      ])
    ];

    autoTable(doc, {
      startY: 65,
      head: [['DESCRIPCIÓN', 'P. UNITARIO', 'CANT.', 'UNIDAD', 'TOTAL']],
      body: bodyManoObra,
      headStyles: { fillColor: [100, 150, 50], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: { 0: { cellWidth: 85 } },
      theme: 'grid'
    });

    // 4. TABLA DE MATERIALES
    const itemsMateriales = this.cotizacion.items.filter(i => i.tipo === 'Material');
    if (itemsMateriales.length > 0) {
      const bodyMateriales: any[] = [
        [{ content: 'MATERIALES', colSpan: 5, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }],
        ...itemsMateriales.map(i => [
          i.descripcion, `$${i.precioUnitario.toLocaleString()}`, i.cantidad, i.unidad, `$${(i.cantidad * i.precioUnitario).toLocaleString()}`
        ])
      ];

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 5,
        body: bodyMateriales,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: { 0: { cellWidth: 85 } }
      });
    }

    const currentY = (doc as any).lastAutoTable.finalY + 10;

    // 5. DATOS BANCARIOS Y TIEMPO (Lado Izquierdo)
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DE PAGO:", 20, currentY);
    doc.setFont("helvetica", "normal");
    doc.text("BBVA - CUENTA: 156 959 6521", 20, currentY + 5);
    doc.text("CLABE: 012 1800156 9596 5217", 20, currentY + 10);
    doc.setFont("helvetica", "bold");
    doc.text("TIEMPO DE ENTREGA:", 20, currentY + 20);
    doc.setFont("helvetica", "normal");
    doc.text("2 DÍAS (Sujeto a cambios)", 20, currentY + 23);

    // 6. DESGLOSE FINAL (Lado Derecho)
    const finalY = currentY;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`SUMA TOTAL: $${this.cotizacion.subtotal.toLocaleString()}`, pageWidth - 20, currentY, { align: 'right' });
    doc.text(`- COTIZACIÓN/VISITA: $${this.proyecto.costoVisita.toLocaleString()}`, pageWidth - 20, currentY + 6, { align: 'right' });
    doc.setFontSize(13);
    doc.setTextColor(100, 150, 50);
    doc.text(`TOTAL NETO: $${this.cotizacion.totalNeto.toLocaleString()}`, pageWidth - 20, currentY + 14, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(0);
    const pagoDividido = this.cotizacion.totalNeto / 2;
    doc.text(`ANTICIPO (50%): $${pagoDividido.toLocaleString()}`, pageWidth - 20, finalY + 22, { align: 'right' });
    doc.setFont("helvetica", "bold");
    doc.text(`FINIQUITO VS ENTREGA: $${pagoDividido.toLocaleString()}`, pageWidth - 20, finalY + 28, { align: 'right' });
    
    // 7. CLÁUSULAS (Sección Crítica)
    const clausulasY = finalY + 60;
    doc.setFontSize(7);
    doc.setTextColor(100);
    const clausulas = [
      "* PRECIOS EN MONEDA NACIONAL (MXN). PRECIOS NO INCLUYEN I.V.A.",
      "* VIGENCIA DE COTIZACIÓN: 15 DÍAS NATURALES.",
      "* PRECIOS DE MATERIALES SUJETOS A CAMBIO SIN PREVIO AVISO.",
      "* EL ÁREA DE TRABAJO DEBERÁ ESTAR DESPEJADA PARA REALIZAR EL SERVICIO.",
      "* EN CASO DE DAÑOS MAYORES O ESTRUCTURALES NO DETECTADOS, SE NOTIFICARÁ Y COTIZARÁ POR SEPARADO."
    ];
    clausulas.forEach((linea, index) => {
      doc.text(linea, 20, clausulasY + (index * 4));
    });

    // 8. PIE DE PÁGINA
    const footerY = 275;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("DIEGO LÓPEZ (HANDY QUEER)", 20, footerY);
    doc.setFont("helvetica", "normal");
    doc.text("Cel: 656 148 3833 | diego.lopmolina@gmail.com", 20, footerY + 5);
    doc.text("¡GRACIAS POR LA CONFIANZA!", pageWidth / 2, footerY + 10, { align: 'center' });

    // 9. RENDER
    this.pdfBlob = doc.output('blob');
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.pdfBlob) + '#view=FitH');
  }

  onEditar() {
    this.editar.emit(this.cotizacion); 
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