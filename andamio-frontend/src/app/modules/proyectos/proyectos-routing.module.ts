import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProyectosComponent } from './pages/list-proyectos/list-proyectos.component';

const routes: Routes = [
  { path: '', component: ListProyectosComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectosRoutingModule { }
