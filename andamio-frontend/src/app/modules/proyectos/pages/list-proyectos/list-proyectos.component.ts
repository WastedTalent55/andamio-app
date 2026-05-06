import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../../../../data/services/proyecto.service';
import { Proyecto } from '../../../../data/models/proyecto.model';
import { ProyectoFormComponent } from '../../components/proyecto-form/proyecto-form.component';

@Component({
  selector: 'app-list-proyectos',
  imports: [ProyectoFormComponent],
  templateUrl: './list-proyectos.component.html',
  styleUrl: './list-proyectos.component.scss'
})
export class ListProyectosComponent implements OnInit {
  proyectos: Proyecto[] = [];
  mostrarModal = false;

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.proyectos = this.proyectoService.getProyectos();
  }

  // ESTA ES LA FUNCIÓN QUE TE FALTA
  agregarProyectoALista(proyecto: Proyecto) {
    // Como el servicio ya guardó el proyecto en el LocalStorage dentro del componente hijo,
    // aquí solo necesitamos recargar la lista y cerrar el modal.
    this.cargarProyectos();
    this.mostrarModal = false;
  }
  
  abrirModal() {
    this.mostrarModal = true;
  }
}
