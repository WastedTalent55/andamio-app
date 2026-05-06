import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Proyecto, Cotizacion } from '../models/proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  async generarCotizacionPDF(proyecto: Proyecto, cotizacion: Cotizacion) {
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '750px'; // Ancho similar a A4
    tempDiv.style.padding = '40px';
    tempDiv.style.backgroundColor = 'white';
    
    // Filtramos los items para el desglose
    const manoDeObra = cotizacion.items.filter(i => i.tipo === 'Mano de Obra');
    const materiales = cotizacion.items.filter(i => i.tipo === 'Material');
    const sumaMateriales = materiales.reduce((acc, curr) => acc + curr.total, 0);

    tempDiv.innerHTML = `
      <div style="font-family: 'Helvetica', sans-serif; color: #333;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
          <div>
            <h1 style="color: #edba12; margin: 0; font-size: 42px; font-weight: bold; letter-spacing: 2px;">ANDAMIO</h1>
            <p style="margin: 0; font-size: 14px; color: #666;">Servicios de Construcción y Mantenimiento</p>
          </div>
          <div style="background: #f2f2f2; padding: 15px; border-radius: 5px; min-width: 200px;">
            <p style="margin: 0; font-size: 12px;"><strong>CLIENTX:</strong> ${proyecto.nombre}</p>
            <p style="margin: 5px 0; font-size: 12px;"><strong>FECHA:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 0; font-size: 12px;"><strong>DIRECCIÓN:</strong> ${proyecto.direccionVisita}</p>
          </div>
        </div>

        <h2 style="text-align: center; border-bottom: 2px solid #edba12; padding-bottom: 10px; margin-bottom: 30px;">COTIZACIÓN</h2>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #edba12; color: white;">
              <th style="padding: 10px; text-align: left;">DESCRIPCIÓN (MANO DE OBRA)</th>
              <th style="padding: 10px;">P. UNITARIO</th>
              <th style="padding: 10px;">CANT.</th>
              <th style="padding: 10px;">UNIDAD</th>
              <th style="padding: 10px;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${manoDeObra.map(item => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${item.descripcion}</td>
                <td style="padding: 10px; text-align: center;">$${item.precioUnitario}</td>
                <td style="padding: 10px; text-align: center;">${item.cantidad}</td>
                <td style="padding: 10px; text-align: center;">${item.unidad}</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">$${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${materiales.length > 0 ? `
          <h4 style="margin-bottom: 10px;">MATERIALES:</h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            ${materiales.map(item => `
              <tr style="border-bottom: 1px solid #eee; font-size: 13px;">
                <td style="padding: 5px;">${item.descripcion}</td>
                <td style="padding: 5px; text-align: right;">$${item.precioUnitario} x ${item.cantidad} ${item.unidad}</td>
                <td style="padding: 5px; text-align: right; font-weight: bold;">$${item.total}</td>
              </tr>
            `).join('')}
            <tr style="background: #f9f9f9;">
              <td colspan="2" style="padding: 5px; text-align: right;"><strong>SUMA TOTAL DE MATERIALES:</strong></td>
              <td style="padding: 5px; text-align: right; font-weight: bold;">$${sumaMateriales}</td>
            </tr>
          </table>
        ` : ''}

        <div style="display: flex; justify-content: space-between; margin-top: 40px; border-top: 2px solid #edba12; padding-top: 20px;">
          <div style="font-size: 12px;">
            <p><strong>PAGO: BBVA</strong></p>
            <p>CUENTA: 156 959 6521</p>
            <p>CLABE: 012 180015695965214</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 16px;">Subtotal Obra: $${cotizacion.subtotal}</p>
            <p style="margin: 5px 0; font-size: 16px; color: #d9534f;">Menos Visita: -$${proyecto.costoVisita}</p>
            <h3 style="margin: 0; font-size: 24px; color: #edba12;">TOTAL NETO: $${cotizacion.totalNeto}</h3>
            <div style="margin-top: 15px; background: #f2f2f2; padding: 10px;">
              <p style="margin: 0;"><strong>Anticipo (50%): $${cotizacion.anticipo}</strong></p>
              <p style="margin: 0;">Finiquito (50%): $${cotizacion.finiquito}</p>
            </div>
          </div>
        </div>

        <div style="margin-top: 30px; font-size: 10px; color: #777; line-height: 1.4;">
          <p><strong>CLÁUSULAS:</strong></p>
          <p>• Los precios están sujetos a cambios sin previo aviso.</p>
          <p>• El tiempo de entrega se pacta al recibir el anticipo.</p>
          <p>• Garantía de 30 días en mano de obra bajo condiciones normales de uso.</p>
        </div>
      </div>
    `;

    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Cotizacion_${proyecto.nombre}_V${cotizacion.version}.pdf`);
    } finally {
      document.body.removeChild(tempDiv);
    }
  }
}