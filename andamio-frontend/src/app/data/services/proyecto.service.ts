import { Injectable } from '@angular/core';
import { Proyecto } from '../models/proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private readonly STORAGE_KEY = 'andamio_proyectos';

  constructor() { }

  getProyectos(): Proyecto[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  guardarProyecto(proyecto: Proyecto): void {
  const proyectos = this.getProyectos();
  
  // ASEGURAR ID: Si no tiene ID, le asignamos uno basado en el tiempo actual
  if (!proyecto.id) {
    proyecto.id = Date.now(); 
  }

  proyectos.push(proyecto);
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(proyectos));
  
  console.log('Proyecto guardado en LocalStorage:', proyecto);
}

  actualizarProyecto(proyectoActualizado: Proyecto): void {
  const proyectos = this.getProyectos();
  const index = proyectos.findIndex(p => p.id === proyectoActualizado.id);
  if (index !== -1) {
    proyectos[index] = proyectoActualizado;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(proyectos));
  }
}
}