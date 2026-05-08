import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Proyecto, Cotizacion } from '../../../../data/models/proyecto.model';
import { PdfService } from '../../../../data/services/pdf.service';

@Component({
  selector: 'app-cotizacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cotizacion-form.component.html',
  styleUrl: './cotizacion-form.component.scss'
})
export class CotizacionFormComponent implements OnInit {
  @Input() proyecto!: Proyecto; 
  @Input() cotizacionAEditar?: Cotizacion; 
  @Output() cerrar = new EventEmitter<void>();
  @Output() cotizacionGuardada = new EventEmitter<Cotizacion>(); 
  cotizacionForm!: FormGroup;

  // Variables para los cálculos que se muestran en el HTML
  subtotal: number = 0;
  totalNeto: number = 0;
  anticipo: number = 0;
  finiquito: number = 0;

  constructor(private fb: FormBuilder,
              private pdfService: PdfService
  ) {}

  ngOnInit(): void {
  this.cotizacionForm = this.fb.group({
    items: this.fb.array([]), 
    descuento: [0, [Validators.min(0)]]
  });

  // Escuchamos cambios para calcular totales
  this.cotizacionForm.valueChanges.subscribe(() => {
    this.calcularTotales();
  });

  // LÓGICA DE CARGA:
  if (this.cotizacionAEditar) {
    // Si estamos editando, llenamos el FormArray con los items existentes
    this.cotizacionAEditar.items.forEach(item => {
      this.items.push(this.fb.group({
        tipo: [item.tipo, Validators.required],
        descripcion: [item.descripcion, Validators.required],
        unidad: [item.unidad, Validators.required],
        cantidad: [item.cantidad, [Validators.required, Validators.min(0.1)]],
        precioUnitario: [item.precioUnitario, [Validators.required, Validators.min(0)]]
      }));
    });
  } else {
    // Si es nueva, empezamos con una fila vacía normal
    this.agregarItem();
  }

  this.calcularTotales(); // Forzamos el primer cálculo
}

get tituloModal(): string {
  return this.cotizacionAEditar ? 'Editar Cotización' : 'Generar Cotización';
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
    // 1. Creamos el objeto de cotización con los totales actuales
    const nuevaCotizacion: Cotizacion = {
      version: (this.proyecto?.cotizaciones?.length || 0) + 1,
      items: this.items.value,
      subtotal: this.subtotal,
      descuento: this.proyecto?.costoVisita || 0,
      totalObra: this.subtotal,
      totalNeto: this.totalNeto,
      anticipo: this.anticipo,
      finiquito: this.finiquito,
      fechaCreacion: new Date()
    };

    // 3. Emitimos para guardar en la lista
    this.cotizacionGuardada.emit(nuevaCotizacion);
    this.cerrar.emit();

    this.cotizacionGuardada.emit(nuevaCotizacion);
  }

  cancelar() {
    this.cerrar.emit();
  }
}