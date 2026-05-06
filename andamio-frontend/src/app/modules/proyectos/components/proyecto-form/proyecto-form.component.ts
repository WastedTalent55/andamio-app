import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../../../data/services/cliente.service';
import { ProyectoService } from '../../../../data/services/proyecto.service';
import { Cliente } from '../../../../data/models/cliente.model';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './proyecto-form.component.html'
})
export class ProyectoFormComponent implements OnInit {
  @Output() proyectoGuardado = new EventEmitter<any>();
  @Output() cerrar = new EventEmitter<void>();

  proyectoForm!: FormGroup;
  clientesDisponibles: Cliente[] = [];
  direccionesSugeridas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {
    // 1. Cargar clientes activos para el selector
    this.clientesDisponibles = this.clienteService.getClientes().filter(c => c.estaActivo);

    // 2. Inicializar el formulario
    this.proyectoForm = this.fb.group({
      clienteId: ['', Validators.required],
      nombre: ['', Validators.required],
      fechaVisita: ['', Validators.required],
      direccionVisita: ['', Validators.required],
      costoVisita: [0, [Validators.required, Validators.min(0)]]
    });

    // 3. LA MAGIA: Escuchar cuando cambie el cliente seleccionado
    this.proyectoForm.get('clienteId')?.valueChanges.subscribe(id => {
      this.actualizarDirecciones(id);
    });
  }

  actualizarDirecciones(clienteId: string) {
    const cliente = this.clientesDisponibles.find(c => c.id === Number(clienteId));
    if (cliente) {
      this.direccionesSugeridas = cliente.ubicaciones;
      // Opcional: Si solo tiene una dirección, ponerla por defecto
      if (this.direccionesSugeridas.length === 1) {
        this.proyectoForm.patchValue({ direccionVisita: this.direccionesSugeridas[0] });
      }
    }
  }

  guardar() {
    if (this.proyectoForm.valid) {
      const nuevoProyecto = {
        ...this.proyectoForm.value,
        id: Date.now(),
        estado: 'Cita'
      };
      
      console.log('¡Proyecto listo para la obra!', nuevoProyecto);
      
      this.proyectoService.guardarProyecto(nuevoProyecto);
      
      // CAMBIO AQUÍ: Usa el nombre que declaraste arriba en el @Output
      this.proyectoGuardado.emit(nuevoProyecto); 
      
      this.proyectoForm.reset();
      this.cerrar.emit(); // También emitimos cerrar para que se quite el modal
    } else {
      alert('¡Cuidado! Te faltan campos por llenar.');
    }
  }

  cancelar() {
    this.cerrar.emit();
  }
}