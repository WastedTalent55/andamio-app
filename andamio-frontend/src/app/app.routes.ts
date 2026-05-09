import { Routes } from '@angular/router';
import { DashboardHomeComponent } from './modules/dashboard/pages/dashboard-home/dashboard-home.component';

export const routes: Routes = [
  { 
    path: '', component: DashboardHomeComponent 
  },
  {
    path: 'clientes',
    loadComponent: () => import('./modules/clientes/pages/list-clientes/list-clientes.component').then(m => m.ListClientesComponent)
  },
  { 
    path: 'proyectos', 
    loadComponent: () => import('./modules/proyectos/pages/list-proyectos/list-proyectos.component').then(m => m.ListProyectosComponent) 
  }
];