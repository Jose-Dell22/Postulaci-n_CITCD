import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/inicio/inicio.component').then((m) => m.InicioComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'convocatorias',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/convocatorias/convocatorias.component').then((m) => m.ConvocatoriasComponent)
  },
  {
    path: 'convocatorias/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/convocatorias/detalle/detalle.component').then((m) => m.ConvocatoriaDetailComponent)
  },
  {
    path: 'postulaciones',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/postulaciones/postulaciones.component').then((m) => m.PostulacionesComponent)
  },
  {
    path: 'reportes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/reportes/reportes.component').then((m) => m.ReportesComponent)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/usuarios/usuarios.component').then((m) => m.UsuariosComponent)
  },
  {
    path: 'categorias',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/categorias/categorias.component').then((m) => m.CategoriasComponent)
  },
  { path: '**', redirectTo: '' }
];
