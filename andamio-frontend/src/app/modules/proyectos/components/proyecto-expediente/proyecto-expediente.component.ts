import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectoService } from '../../../../data/services/proyecto.service';
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

  mostrarFormPago = false;
  mostrarFormGasto = false;
  diasTranscurridos: number = 0;
  progresoTiempo: number = 0;

  constructor(private proyectoService: ProyectoService) {} 

  ngOnInit(): void {
    this.calcularTiempos();
  }

  abrirModalGasto() {
  this.mostrarFormGasto = true;
}

guardarGasto(desc: string, monto: string) {
  if (!desc || !monto) return;

  const nuevoGasto = {
    descripcion: desc,
    monto: Number(monto),
    fecha: new Date()
  };

  if (!this.proyecto.detallesGastos) {
    this.proyecto.detallesGastos = [];
  }

  this.proyecto.detallesGastos.push(nuevoGasto);
  
  // Actualizamos el total de gastos reales para que el getter de utilidad funcione
  this.proyecto.gastosReales = (this.proyecto.gastosReales || 0) + Number(monto);

  this.proyectoService.actualizarProyecto(this.proyecto);
  this.mostrarFormGasto = false;
}

  // --- LÓGICA DE TIEMPOS ---
  calcularTiempos() {
    if (this.proyecto && this.proyecto.fechaInicioObra) {
      const inicio = new Date(this.proyecto.fechaInicioObra);
      const hoy = new Date();
      const diffTime = Math.abs(hoy.getTime() - inicio.getTime());
      this.diasTranscurridos = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
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

  // --- GETTERS FINANCIEROS (REACTIVOS) ---
  get totalPresupuestado(): number {
    if (!this.proyecto.cotizaciones || this.proyecto.cotizaciones.length === 0) return 0;
    return this.proyecto.cotizaciones[this.proyecto.cotizaciones.length - 1].totalNeto;
  }

  get totalPagado(): number {
    return (this.proyecto.pagos || []).reduce((acc, pago) => acc + pago.monto, 0);
  }

  get saldoPendiente(): number {
    return this.totalPresupuestado - this.totalPagado;
  }

  get porcentajeCobrado(): number {
    if (this.totalPresupuestado === 0) return 0;
    return (this.totalPagado / this.totalPresupuestado) * 100;
  }

  // --- GESTIÓN DE PAGOS ---
  abrirModalPago() {
    this.mostrarFormPago = true;
  }

  guardarPago(monto: string, metodo: any, nota: string) {
    if (!monto || Number(monto) <= 0) return;

    const nuevoPago: Pago = {
      id: Date.now(),
      monto: Number(monto),
      fecha: new Date(),
      metodo: metodo,
      nota: nota
    };

    if (!this.proyecto.pagos) {
      this.proyecto.pagos = [];
    }

    this.proyecto.pagos.push(nuevoPago);
    
    // Guardamos en LocalStorage
    this.proyectoService.actualizarProyecto(this.proyecto);

    // Cerramos modal y la vista se actualizará sola gracias a los getters
    this.mostrarFormPago = false;
  }

  // En proyecto-expediente.component.ts

get utilidadEstimada(): number {
  // Utilidad = Total Cobrado - Gastos Reales
  return this.totalPagado - (this.proyecto.gastosReales || 0);
}
}