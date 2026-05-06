import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProyectoComponent } from './card-proyecto.component';

describe('CardProyectoComponent', () => {
  let component: CardProyectoComponent;
  let fixture: ComponentFixture<CardProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProyectoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
