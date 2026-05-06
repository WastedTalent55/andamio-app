import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})

export class ClienteService {
  private readonly STORAGE_KEY = 'andamio_clientes';

  constructor() { }

  // Obtener clientes del LocalStorage
  getClientes(): Cliente[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Guardar un nuevo cliente
  agregarCliente(cliente: Cliente): void {
    const clientes = this.getClientes();
    clientes.push(cliente);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clientes));
  }
}
