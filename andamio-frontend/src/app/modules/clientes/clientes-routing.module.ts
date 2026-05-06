import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListClientesComponent } from './pages/list-clientes/list-clientes.component';

const routes: Routes = [
  {
    path: '', // Este es el camino por defecto del módulo
    component: ListClientesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
