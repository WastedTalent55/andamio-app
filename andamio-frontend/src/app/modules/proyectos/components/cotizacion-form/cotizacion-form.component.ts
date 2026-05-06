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
  @Input() proyecto!: Proyecto; 
  @Output() cerrar = new EventEmitter<void>();
  @Output() cotizacionGuardada = new EventEmitter<any>(); // Cambié el nombre para no chocar con el método

  cotizacionForm!: FormGroup;

  // Variables para los cálculos que se muestran en el HTML
  subtotal: number = 0;
  totalNeto: number = 0;
  anticipo: number = 0;
  finiquito: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cotizacionForm = this.fb.group({
      items: this.fb.array([]), 
      descuento: [0, [Validators.min(0)]]
    });

    // Escuchamos cambios para calcular totales en tiempo real
    this.cotizacionForm.valueChanges.subscribe(() => {
      this.calcularTotales();
    });

    // Empezamos con una fila vacía
    this.agregarItem();
  }

  // Getter ÚNICO para el FormArray
  get items() {
    return this.cotizacionForm.get('items') as FormArray;
  }

  // Método ÚNICO para añadir fila
  agregarItem() {
    const itemGroup = this.fb.group({
      tipo: ['Material', Validators.required],
      descripcion: ['', Validators.required],
      unidad: ['m2', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(0.1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]]
    });
    this.items.push(itemGroup);
  }

  eliminarItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  calcularTotales() {
    this.subtotal = this.items.controls.reduce((acc, control) => {
      const cant = control.get('cantidad')?.value || 0;
      const precio = control.get('precioUnitario')?.value || 0;
      return acc + (cant * precio);
    }, 0);

    // Lógica de negocio: Total menos lo que ya pagó en la visita
    this.totalNeto = this.subtotal - (this.proyecto?.costoVisita || 0);
    
    // Si el total neto es negativo (porque el costo de visita es mayor a la obra), lo dejamos en 0
    if (this.totalNeto < 0) this.totalNeto = 0;

    this.anticipo = this.totalNeto / 2;
    this.finiquito = this.totalNeto / 2;
  }

  // Método para el botón del HTML
  enviarCotizacion() {
    if (this.cotizacionForm.valid) {
      const nuevaCotizacion = {
        items: this.cotizacionForm.value.items,
        subtotal: this.subtotal,
        totalNeto: this.totalNeto,
        anticipo: this.anticipo,
        finiquito: this.finiquito,
        fecha: new Date()
      };
      
      console.log('¡Cotización generada!', nuevaCotizacion);
      this.cotizacionGuardada.emit(nuevaCotizacion);
      this.cerrar.emit();
    } else {
      alert('Por favor, completa los campos obligatorios de la tabla.');
    }
  }

  cancelar() {
    this.cerrar.emit();
  }
}