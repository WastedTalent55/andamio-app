import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../../../../data/services/proyecto.service';
import { Proyecto } from '../../../../data/models/proyecto.model';
import { ProyectoFormComponent } from '../../components/proyecto-form/proyecto-form.component';
import { DatePipe } from '@angular/common';
import { ClienteService } from '../../../../data/services/cliente.service';

@Component({
  selector: 'app-list-proyectos',
  imports: [ProyectoFormComponent, DatePipe],
  templateUrl: './list-proyectos.component.html',
  styleUrl: './list-proyectos.component.scss'
})
export class ListProyectosComponent implements OnInit {
  proyectosEvaluacion: Proyecto[] = [];
  proyectosCotizacion: Proyecto[] = [];
  proyectosEnObra: Proyecto[] = [];
  proyectoSeleccionado?: Proyecto;
  mostrarModal = false;

  constructor(private proyectoService: ProyectoService,
              private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  getDatosCliente(clienteId: number) {
    return this.clienteService.getClientes().find(c => c.id === Number(clienteId));
  }

  cargarProyectos() {
    const todos = this.proyectoService.getProyectos();
    // Los separamos para mostrarlos en columnas o secciones
    this.proyectosEvaluacion = todos.filter(p => p.estado === 'Cita');
    this.proyectosCotizacion = todos.filter(p => p.estado === 'Cotización');
    this.proyectosEnObra = todos.filter(p => p.estado === 'En Progreso');
  }

  agregarProyectoALista(proyecto: Proyecto) {
    // Como el servicio ya guardó el proyecto en el LocalStorage dentro del componente hijo,
    // aquí solo necesitamos recargar la lista y cerrar el modal.
    this.cargarProyectos();
    this.mostrarModal = false;
  }
  
  abrirModal() {
    this.proyectoSeleccionado = undefined;
    this.mostrarModal = true;
  }

  cerrarModal() {
  this.mostrarModal = false;
  this.proyectoSeleccionado = undefined;
}

  prepararCotizacion(proyecto: Proyecto) {
    console.log('Vamos a cotizar el proyecto:', proyecto.nombre);
    // Por ahora solo el log para que el botón funcione
  }

  cancelarProyecto(proyecto: Proyecto) {
  if (confirm(`¿Estás seguro de cancelar la evaluación de "${proyecto.nombre}"?`)) {
    // Actualizamos el estado
    proyecto.estado = 'Cancelado'; 
    // Guardamos el cambio en el servicio (necesitaremos un método update)
    this.proyectoService.actualizarProyecto(proyecto);
    this.cargarProyectos(); // Refrescar tablero
  }
}

  editarProyecto(proyecto: Proyecto) {
    this.proyectoSeleccionado = proyecto; // Pasamos el proyecto a editar
    this.mostrarModal = true;
  }
}
