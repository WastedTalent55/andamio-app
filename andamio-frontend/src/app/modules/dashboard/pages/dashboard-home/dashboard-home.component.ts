import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectoService } from '../../../../data/services/proyecto.service';
import { Proyecto } from '../../../../data/models/proyecto.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  proyectos: Proyecto[] = [];
  
  metrics = {
    totalPorCobrar: 0,
    obrasActivas: 0,
    utilidadTotal: 0,
    proyectosRetrasados: 0
  };

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit() {
    this.proyectoService.proyectos$.subscribe((proyectos: Proyecto[]) => {
      this.proyectos = proyectos;
      this.calcularMetricas();
    });
  }

  calcularMetricas() {
    this.metrics.obrasActivas = this.proyectos.filter(p => p.estado === 'En Progreso').length;
    
    this.metrics.totalPorCobrar = this.proyectos.reduce((acc, p) => {
      const total = p.cotizaciones?.length ? p.cotizaciones[p.cotizaciones.length - 1].totalNeto : 0;
      const pagado = (p.pagos || []).reduce((sum, pago) => sum + pago.monto, 0);
      return acc + (total - pagado);
    }, 0);

    this.metrics.utilidadTotal = this.proyectos.reduce((acc, p) => {
      const pagado = (p.pagos || []).reduce((sum, pago) => sum + pago.monto, 0);
      const gastos = p.gastosReales || 0;
      return acc + (pagado - gastos);
    }, 0);
  }
}