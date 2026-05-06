import { Component } from '@angular/core';

@Component({
  selector: 'app-cotizacion-form',
  imports: [],
  templateUrl: './cotizacion-form.component.html',
  styleUrl: './cotizacion-form.component.scss'
})
export class CotizacionFormComponent {
  // Estructura sugerida para el FormBuilder
  this.cotizacionForm = this.fb.group({
    items: this.fb.array([]), // Aquí irán las filas dinámicas
    descuento: [0],
    // Los totales se calculan automáticamente
  });

  // Método para añadir fila
  agregarItem() {
    const itemForm = this.fb.group({
      tipo: ['material'], // o 'mano-obra'
      descripcion: ['', Validators.required],
      unidad: ['m2'], // servicio, litros, etc.
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]]
    });
    this.items.push(itemForm);
  }
}
