import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoExpedienteComponent } from './proyecto-expediente.component';

describe('ProyectoExpedienteComponent', () => {
  let component: ProyectoExpedienteComponent;
  let fixture: ComponentFixture<ProyectoExpedienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoExpedienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
