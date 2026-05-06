import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../../data/services/cliente.service';
import { Cliente } from '../../../../data/models/cliente.model';
import { ClienteFormComponent } from '../../components/cliente-form/cliente-form.component';

@Component({
  selector: 'app-list-clientes',
  imports: [ClienteFormComponent],
  templateUrl: './list-clientes.component.html',
  styleUrl: './list-clientes.component.scss'
})
export class ListClientesComponent implements OnInit {
  misClientes: Cliente[] = [];
  mostrarModal = false;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.misClientes = this.clienteService.getClientes().filter(c => c.estaActivo);
  }

  agregarALista(nuevo: Cliente) {
    this.clienteService.agregarCliente(nuevo); // Guarda en LocalStorage
    this.cargarClientes(); // Refresca la lista
    this.mostrarModal = false;
  }

  confirmarEliminar(cliente: Cliente) {
    const siEliminar = confirm(`¿Seguro que quieres quitar a ${cliente.nombre} de tu lista? No se borrarán sus proyectos pasados, pero ya no lo verás aquí.`);
    
    if (siEliminar) {
      this.clienteService.desactivarCliente(cliente.id);
      this.cargarClientes(); // Recargamos la lista filtrada
    }
  }
}
