import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';

export type UserRole = 'ADMINISTRADOR' | 'DOCENTE' | 'ESTUDIANTE';

export interface RoleOption {
  title: string;
  description: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule, MatCardModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly userEmail = this.authService.getUserEmail();
  readonly userRole = this.authService.getUserRole() as UserRole | null;

  readonly roleInfo: Record<UserRole, { label: string; icon: string; color: string; options: RoleOption[] }> = {
    ADMINISTRADOR: {
      label: 'Administrador',
      icon: 'shield',
      color: '#b5121b',
      options: [
        { title: 'Usuarios', description: 'Gestionar usuarios del sistema', icon: 'people', route: '/usuarios' },
        { title: 'Convocatorias', description: 'Crear y gestionar convocatorias', icon: 'campaign', route: '/convocatorias' },
        { title: 'Categorías', description: 'Administrar categorías', icon: 'category', route: '/categorias' },
        { title: 'Reportes', description: 'Ver reportes del sistema', icon: 'bar_chart', route: '/reportes' }
      ]
    },
    DOCENTE: {
      label: 'Docente',
      icon: 'school',
      color: '#1565c0',
      options: [
        { title: 'Convocatorias', description: 'Ver convocatorias disponibles', icon: 'campaign', route: '/convocatorias' },
        { title: 'Postulaciones', description: 'Revisar postulaciones recibidas', icon: 'assignment', route: '/postulaciones' },
        { title: 'Reportes', description: 'Ver reportes de postulaciones', icon: 'bar_chart', route: '/reportes' }
      ]
    },
    ESTUDIANTE: {
      label: 'Estudiante',
      icon: 'person',
      color: '#2e7d32',
      options: [
        { title: 'Convocatorias', description: 'Explorar convocatorias activas', icon: 'campaign', route: '/convocatorias' },
        { title: 'Mis Postulaciones', description: 'Ver mis postulaciones', icon: 'assignment', route: '/postulaciones' },
        { title: 'Postularme', description: 'Postularme a una convocatoria', icon: 'how_to_reg', route: '/postulaciones' }
      ]
    }
  };

  get currentRoleInfo() {
    return this.userRole ? this.roleInfo[this.userRole] : null;
  }

  navigate(route?: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
