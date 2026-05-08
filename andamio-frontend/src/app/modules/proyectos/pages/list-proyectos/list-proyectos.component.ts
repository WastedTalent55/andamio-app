import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../../../../data/services/proyecto.service';
import { Proyecto } from '../../../../data/models/proyecto.model';
import { Cotizacion } from '../../../../data/models/proyecto.model';
import { ProyectoFormComponent } from '../../components/proyecto-form/proyecto-form.component';
import { ClienteService } from '../../../../data/services/cliente.service';
import { CotizacionFormComponent } from '../../components/cotizacion-form/cotizacion-form.component';
import { CardProyectoComponent } from '../../components/card-proyecto/card-proyecto.component';
import { PdfPreviewModalComponent } from '../../components/pdf-preview-modal/pdf-preview-modal.component';

@Component({
  selector: 'app-list-proyectos',
  imports: [ProyectoFormComponent, CotizacionFormComponent, CardProyectoComponent, PdfPreviewModalComponent],
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
    this.proyectosCotizacion = todos.filter(p => p.estado === 'Cotizacion');
    this.proyectosEnObra = todos.filter(p => p.estado === 'En Progreso');

    console.log('Estado del Storage:', todos);
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

  // Variables de control
  mostrarModalCotizacion: boolean = false;
  proyectoParaCotizar?: Proyecto;
  mostrarModalPdf = false;
  cotizacionParaVer?: Cotizacion;
  cotizacionParaEditar?: Cotizacion;
  esEdicion: boolean = false;
  proyectoParaPdf?: Proyecto;

  // Función para el botón "Cotizar" de la tarjeta
  prepararCotizacion(proyecto: Proyecto) {
    this.proyectoParaCotizar = proyecto;
    this.mostrarModalCotizacion = true;
  }

  cerrarModalCotizacion() {
    this.mostrarModalCotizacion = false;
    this.proyectoParaCotizar = undefined;
  }

  actualizarProyectoConCotizacion(nuevaCotizacion: Cotizacion) {
  if (this.proyectoParaCotizar) {
    if (!this.proyectoParaCotizar.cotizaciones) {
      this.proyectoParaCotizar.cotizaciones = [];
    }

    // SI ESTAMOS EDITANDO: Reemplazamos la última en lugar de hacer push
    if (this.cotizacionParaEditar) {
      const index = this.proyectoParaCotizar.cotizaciones.indexOf(this.cotizacionParaEditar);
      if (index !== -1) {
        this.proyectoParaCotizar.cotizaciones[index] = nuevaCotizacion;
      }
    } else {
      // SI ES NUEVA: Hacemos el push normal
      this.proyectoParaCotizar.cotizaciones.push(nuevaCotizacion);
    }

    this.proyectoParaCotizar.estado = 'Cotizacion';
    this.proyectoService.actualizarProyecto(this.proyectoParaCotizar);
    this.cargarProyectos();
    
    // Limpiamos la variable de edición
    this.cotizacionParaEditar = undefined; 
    this.cerrarModalCotizacion();
  }
}

  agendarObra(proyecto: Proyecto) {
    if (confirm(`¿Confirmas que la cotización para "${proyecto.nombre}" fue aprobada?`)) {
      // 1. Cambiamos el estado
      proyecto.estado = 'En Progreso';
      
      // 2. Actualizamos en el servicio (y por ende en LocalStorage)
      this.proyectoService.actualizarProyecto(proyecto);
      
      // 3. Refrescamos el tablero
      this.cargarProyectos();
      
      console.log('¡Proyecto en obra! 🛠️');
    }
  }

  verPdf(proyecto: Proyecto) {
    const cliente = this.getDatosCliente(proyecto.clienteId);
    this.proyectoParaPdf = { 
      ...proyecto, 
      nombreCliente: cliente?.nombre, 
      telefonoCliente: cliente?.contacto
    };
    this.cotizacionParaVer = proyecto.cotizaciones![proyecto.cotizaciones!.length - 1];
    this.mostrarModalPdf = true;
  } 

  // En list-proyectos.component.ts

abrirEdicionDesdePdf() {
  this.mostrarModalPdf = false;

  if (this.proyectoParaPdf) {
    this.proyectoParaCotizar = this.proyectoParaPdf;
    
    // 1. Buscamos la última cotización (la que estamos viendo en el PDF)
    if (this.proyectoParaPdf.cotizaciones && this.proyectoParaPdf.cotizaciones.length > 0) {
      this.cotizacionParaEditar = this.proyectoParaPdf.cotizaciones[this.proyectoParaPdf.cotizaciones.length - 1];
    }
    
    this.mostrarModalCotizacion = true;
  }
}
}
