import { Injectable } from '@angular/core';
import { Proyecto } from '../models/proyecto.model';
import { StorageService } from './storage.service'; 

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private proyectos: Proyecto[] = [];

  constructor(private storageService: StorageService) { 
    // Cargamos lo que haya guardado al iniciar
    this.proyectos = this.storageService.obtenerProyectos();
  }

  getProyectos(): Proyecto[] {
    return this.proyectos;
  }

  guardarProyecto(proyecto: Proyecto): void {
    // 1. Agregamos al arreglo local
    this.proyectos.push(proyecto);
    // 2. Le decimos al storage que actualice la foto completa
    this.storageService.guardarProyectos(this.proyectos);
  }

  actualizarProyecto(proyecto: Proyecto): void {
  const index = this.proyectos.findIndex(p => p.id === proyecto.id);
  if (index !== -1) {
    // Clonamos el objeto para romper la referencia y asegurar que Angular detecte cambios
    this.proyectos[index] = { ...proyecto }; 
    // Guardamos la foto completa y actualizada en LocalStorage
    this.storageService.guardarProyectos(this.proyectos);
    console.log('Storage actualizado con:', this.proyectos);
  }
}
}