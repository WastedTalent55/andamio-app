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
  esAgendarObra: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {
    // 1. Cargar clientes
    this.clientesDisponibles = this.clienteService.getClientes().filter(c => c.estaActivo);

    // 2. Inicializar formulario con valores por defecto para que NUNCA sea null
    this.proyectoForm = this.fb.group({
      clienteId: ['', Validators.required],
      nombre: ['', Validators.required],
      fechaVisita: ['', Validators.required],
      horaVisita: ['', Validators.required],
      direccionVisita: ['', Validators.required],
      costoVisita: [0, [Validators.required, Validators.min(0)]]
    });

    // 3. Lógica específica según el caso
    if (this.proyectoAEditar) {
      // CASO A: Es Agendar Obra (Viene de Cotización)
      if (this.proyectoAEditar.estado === 'Cotizacion') {
        this.esAgendarObra = true;

        this.proyectoForm.addControl('fechaInicioObra', this.fb.control('', Validators.required));
        this.proyectoForm.addControl('horaInicioObra', this.fb.control('', Validators.required));
        this.proyectoForm.addControl('detallesInstalacion', this.fb.control(''));

        // Quitamos obligatoriedad de evaluación para que no bloquee el botón
        const camposEvaluacion = ['fechaVisita', 'horaVisita', 'direccionVisita', 'clienteId'];
        camposEvaluacion.forEach(campo => {
          this.proyectoForm.get(campo)?.clearValidators();
          this.proyectoForm.get(campo)?.updateValueAndValidity();
        });
      }

      // CARGAR DATOS (Para Edición o para Agendar Obra)
      this.proyectoForm.patchValue({
        ...this.proyectoAEditar,
        clienteId: this.proyectoAEditar.clienteId.toString()
      });
      this.actualizarDirecciones(this.proyectoAEditar.clienteId.toString());
    }

    // 4. Escuchar cambios de cliente
    this.proyectoForm.get('clienteId')?.valueChanges.subscribe(id => {
      if (id) this.actualizarDirecciones(id);
    });
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
    if (this.proyectoForm.invalid) {
      alert('Por favor, llena todos los campos obligatorios.');
      return;
    }

    const estadoFinal = this.esAgendarObra ? 'En Progreso' : (this.proyectoAEditar?.estado || 'Cita');

    const datosProyecto: Proyecto = {
      ...this.proyectoAEditar,    // Mantiene IDs, PDFs y fechas de creación
      ...this.proyectoForm.value, // Sobrescribe con lo que hay en el formulario
      estado: estadoFinal         // Asegura la columna correcta
    };

    if (this.proyectoAEditar?.id) {
      this.proyectoService.actualizarProyecto(datosProyecto);
    } else {
      // Si es nuevo, el spread de proyectoAEditar no hace nada, así que generamos ID
      datosProyecto.id = Date.now();
      datosProyecto.fechaCreacion = new Date();
      this.proyectoService.guardarProyecto(datosProyecto);
    }

    this.proyectoGuardado.emit(datosProyecto);
    this.cerrar.emit();
  }

  cancelar() {
    this.cerrar.emit();
  }
}