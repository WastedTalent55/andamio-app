import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'clientes',
    loadChildren: () => import('./modules/clientes/clientes.module').then(m => m.ClientesModule)
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