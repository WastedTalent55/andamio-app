import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto, Pago } from '../../../../data/models/proyecto.model'; 

@Component({
  selector: 'app-proyecto-expediente',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './proyecto-expediente.component.html',
  styleUrl: './proyecto-expediente.component.scss'
})
export class ProyectoExpedienteComponent implements OnInit {
  @Input() proyecto!: Proyecto;
  @Output() cerrar = new EventEmitter<void>();

  diasTranscurridos: number = 0;
  progresoTiempo: number = 0;

  ngOnInit(): void {
    this.calcularTiempos();
  }

  calcularTiempos() {
    if (this.proyecto && this.proyecto.fechaInicioObra) {
      const inicio = new Date(this.proyecto.fechaInicioObra);
      const hoy = new Date();
      
      // Diferencia en días
      const diffTime = Math.abs(hoy.getTime() - inicio.getTime());
      this.diasTranscurridos = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Calcular porcentaje si hay días estimados
      if (this.proyecto.diasEstimados) {
        this.progresoTiempo = (this.diasTranscurridos / this.proyecto.diasEstimados) * 100;
      }
    }
  }

  get estadoRendimiento() {
    if (!this.proyecto.diasEstimados) return 'normal';
    if (this.diasTranscurridos > this.proyecto.diasEstimados) return 'retrasado';
    if (this.progresoTiempo > 80) return 'critico';
    return 'bueno';
  }

  // Añade esto dentro de la clase ProyectoExpedienteComponent

  // 1. Total presupuestado (de la última cotización)
  get totalPresupuestado(): number {
    if (!this.proyecto.cotizaciones || this.proyecto.cotizaciones.length === 0) return 0;
    return this.proyecto.cotizaciones[this.proyecto.cotizaciones.length - 1].totalNeto;
  }

  // 2. Total pagado por el cliente
  get totalPagado(): number {
    return (this.proyecto.pagos || []).reduce((acc, pago) => acc + pago.monto, 0);
  }

  // 3. Saldo pendiente
  get saldoPendiente(): number {
    return this.totalPresupuestado - this.totalPagado;
  }

  // 4. Porcentaje de cobro
  get porcentajeCobrado(): number {
    if (this.totalPresupuestado === 0) return 0;
    return (this.totalPagado / this.totalPresupuestado) * 100;
  }

  // 5. Utilidad estimada (Ingresos - Gastos reales)
  get utilidadEstimada(): number {
    const gastos = this.proyecto.gastosReales || 0;
    return this.totalPresupuestado - gastos;
  }
}