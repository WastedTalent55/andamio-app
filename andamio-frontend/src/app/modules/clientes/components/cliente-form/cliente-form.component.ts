import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Cliente } from '../../../../data/models/cliente.model';
@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss'
})

export class ClienteFormComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() clienteGuardado = new EventEmitter<Cliente>();

  clienteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      contactoDirecto: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  cancelar() {
    this.cerrar.emit();
  }

  enviar() {
    if (this.clienteForm.valid) {
      const nuevo: Cliente = {
        id: Date.now(), // ID temporal
        nombre: this.clienteForm.value.nombre,
        contacto: this.clienteForm.value.contactoDirecto,
        ubicaciones: [this.clienteForm.value.direccion],
        estaActivo: true
      };
      this.clienteGuardado.emit(nuevo);
      this.clienteForm.reset();
    }
  }
}
