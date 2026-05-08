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
    // 1. Cargar clientes
    this.clientesDisponibles = this.clienteService.getClientes().filter(c => c.estaActivo);

    // 2. Inicializar formulario
    this.proyectoForm = this.fb.group({
      clienteId: ['', Validators.required],
      nombre: ['', Validators.required],
      fechaVisita: ['', Validators.required],
      horaVisita: ['', Validators.required], // Agregada para que no falle el form
      direccionVisita: ['', Validators.required],
      costoVisita: [0, [Validators.required, Validators.min(0)]]
    });

    // 3. Escuchar cambios de cliente para las direcciones
    this.proyectoForm.get('clienteId')?.valueChanges.subscribe(id => {
      this.actualizarDirecciones(id);
    });

    // 4. Si viene de "Clientes" o "Edición"
    if (this.proyectoAEditar) {
      const idCliente = this.proyectoAEditar.clienteId.toString();
      
      this.proyectoForm.patchValue({
        clienteId: idCliente,
        nombre: this.proyectoAEditar.nombre || '',
        fechaVisita: this.proyectoAEditar.fechaVisita || '',
        direccionVisita: this.proyectoAEditar.direccionVisita || '',
        costoVisita: this.proyectoAEditar.costoVisita || 0
      });

      this.actualizarDirecciones(idCliente);
    }
  }

  actualizarDirecciones(clienteId: string) {
    const cliente = this.clientesDisponibles.find(c => c.id === Number(clienteId));
    if (cliente) {
      this.direccionesSugeridas = cliente.ubicaciones;
      if (this.direccionesSugeridas.length === 1) {
        this.proyectoForm.patchValue({ direccionVisita: this.direccionesSugeridas[0] });
      }
    }
  }

  // --- ÚNICA FUNCIÓN DE GUARDADO ---
  enviarFormulario() {
    console.log("🚀 Iniciando proceso de guardado...");

    if (this.proyectoForm.invalid) {
      alert('Por favor, llena todos los campos obligatorios.');
      return;
    }

    const datosProyecto: Proyecto = {
      ...this.proyectoForm.value,
      // Si el proyectoAEditar ya tiene ID, lo conservamos. Si no, generamos uno.
      id: this.proyectoAEditar?.id ? this.proyectoAEditar.id : Date.now(),
      estado: this.proyectoAEditar?.id ? this.proyectoAEditar.estado : 'Cita',
    };

    console.log("💾 Objeto a guardar:", datosProyecto);

    if (this.proyectoAEditar?.id) {
      this.proyectoService.actualizarProyecto(datosProyecto);
    } else {
      this.proyectoService.guardarProyecto(datosProyecto);
    }

    this.proyectoGuardado.emit(datosProyecto);
    this.cerrar.emit();
  }

  cancelar() {
    this.cerrar.emit();
  }
}