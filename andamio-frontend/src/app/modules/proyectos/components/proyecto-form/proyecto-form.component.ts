import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../../../data/services/cliente.service';
import { ProyectoService } from '../../../../data/services/proyecto.service';
import { Cliente } from '../../../../data/models/cliente.model';
import { Proyecto } from '../../../../data/models/proyecto.model';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './proyecto-form.component.html'
})
export class ProyectoFormComponent implements OnInit {
  @Input() proyectoAEditar?: Proyecto;
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

    if (this.proyectoAEditar) {
      this.proyectoForm.patchValue({
        clienteId: this.proyectoAEditar.clienteId,
        nombre: this.proyectoAEditar.nombre,
        fechaVisita: this.proyectoAEditar.fechaVisita,
        direccionVisita: this.proyectoAEditar.direccionVisita,
        costoVisita: this.proyectoAEditar.costoVisita
      });
      
      // Forzamos la actualización de direcciones basada en el cliente cargado
      this.actualizarDirecciones(this.proyectoAEditar.clienteId.toString());
    }
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
      
      if (this.proyectoAEditar) {
        // --- MODO EDICIÓN ---
        const proyectoActualizado = {
          ...this.proyectoAEditar, // Mantenemos el ID original y el estado actual
          ...this.proyectoForm.value // Sobrescribimos con lo que hay en el formulario
        };
        
        this.proyectoService.actualizarProyecto(proyectoActualizado); // Usamos actualizar
        this.proyectoGuardado.emit(proyectoActualizado);
        
      } else {
        // --- MODO CREACIÓN ---
        const nuevoProyecto = {
          ...this.proyectoForm.value,
          id: Date.now(), // Generamos ID solo si es nuevo
          estado: 'Cita'
        };
        
        this.proyectoService.guardarProyecto(nuevoProyecto);
        this.proyectoGuardado.emit(nuevoProyecto);
      }
      
      this.proyectoForm.reset();
      this.cerrar.emit(); 
      
    } else {
      alert('¡Cuidado! Te faltan campos por llenar.');
    }
  }

  cancelar() {
    this.cerrar.emit();
  }
}