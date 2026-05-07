import { Injectable } from '@angular/core';
import { Proyecto } from '../models/proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly KEY = 'andamio_proyectos';

  // Guardar todo el arreglo de proyectos
  guardarProyectos(proyectos: Proyecto[]) {
    localStorage.setItem(this.KEY, JSON.stringify(proyectos));
  }

  // Recuperar los proyectos al abrir la app
  obtenerProyectos(): Proyecto[] {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : [];
  }
}