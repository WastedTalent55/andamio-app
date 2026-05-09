import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../../../data/models/proyecto.model'; 

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
}