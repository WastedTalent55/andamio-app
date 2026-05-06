import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Proyecto, Cotizacion } from '../../../../data/models/proyecto.model';

@Component({
  selector: 'app-cotizacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cotizacion-form.component.html',
  styleUrl: './cotizacion-form.component.scss'
})
export class CotizacionFormComponent implements OnInit {
  @Input() proyecto!: Proyecto; // El proyecto al que le haremos la cotización
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardarCotizacion = new EventEmitter<Cotizacion>();

  cotizacionForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicializamos el formulario dentro del OnInit
    this.cotizacionForm = this.fb.group({
      items: this.fb.array([]), // Aquí se guardan las filas dinámicas
      descuento: [0, [Validators.min(0)]]
    });

    // Empezamos con una fila vacía para que no se vea pelón
    this.agregarItem();
  }

  // Getter para acceder fácilmente al FormArray desde el HTML
  get items() {
    return this.cotizacionForm.get('items') as FormArray;
  }

  // Método para añadir una nueva fila de material o mano de obra
  agregarItem() {
    const itemForm = this.fb.group({
      tipo: ['Material', Validators.required],
      descripcion: ['', Validators.required],
      unidad: ['m2', Validators.required], // m2, servicio, pza, etc.
      cantidad: [1, [Validators.required, Validators.min(0.1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }] // Se calcula solo
    });

    this.items.push(itemForm);
  }

  // Método para quitar una fila
  eliminarItem(index: number) {
    this.items.removeAt(index);
  }

  cancelar() {
    this.cerrar.emit();
  }

  guardar() {
    if (this.cotizacionForm.valid) {
      console.log('Datos de la cotización:', this.cotizacionForm.value);
      // Aquí irá la lógica para calcular totales finales y emitir
    } else {
      alert('Por favor, llena todos los campos de la tabla.');
    }
  }
}