import { Component } from '@angular/core';
import { Cliente } from '../../../../data/models/cliente.model';

@Component({
  selector: 'app-list-clientes',
  imports: [],
  templateUrl: './list-clientes.component.html',
  styleUrl: './list-clientes.component.scss'
})
export class ListClientesComponent {
  misClientes: Cliente[] = [
    {
      id: 1,
      nombre: 'Alex Soler',
      contacto: '55 1234 5678',
      ubicaciones: ['Calle Falsa 123, Col. Centro', 'Av. Siempre Viva 742']
    },
    {
      id: 2,
      nombre: 'María García',
      contacto: '55 9876 5432',
      ubicaciones: ['Taller de Costura, Int 4']
    }
  ];
}
