import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'clientes',
    loadComponent: () => import('./modules/clientes/pages/list-clientes/list-clientes.component').then(m => m.ListClientesComponent)
  },
  { 
    path: 'proyectos', 
    loadComponent: () => import('./modules/proyectos/pages/list-proyectos/list-proyectos.component').then(m => m.ListProyectosComponent) 
  },
  {
    path: '',
    redirectTo: 'clientes',
    pathMatch: 'full'
  }
];