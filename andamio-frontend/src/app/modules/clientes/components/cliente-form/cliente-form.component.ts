import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Cliente } from '../../../../data/models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss'
})

export class ClienteFormComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() clienteGuardado = new EventEmitter<Cliente>();

  @Input() clienteAEditar?: Cliente;

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nombre: [this.clienteAEditar?.nombre || '', Validators.required],
      contacto: [this.clienteAEditar?.contacto || '', Validators.required],
      direccion: [this.clienteAEditar?.ubicaciones[0] || '', Validators.required]
    });
  }

  clienteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      contacto: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  cancelar() {
    this.cerrar.emit();
  }

  enviar() {
    if (this.clienteForm.valid) {
      const datos: Cliente = {
        id: this.clienteAEditar ? this.clienteAEditar.id : Date.now(),
        nombre: this.clienteForm.value.nombre,
        contacto: this.clienteForm.value.contacto,
        ubicaciones: [this.clienteForm.value.direccion],
        estaActivo: true
      };
      this.clienteGuardado.emit(datos);
      this.clienteForm.reset();
    }
  }
}
