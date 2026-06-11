import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../core/services/auth.service';

interface Postulacion {
  id: number;
  convocatoria: string;
  estado: string;
  fecha: string;
  solicitante: string;
}

@Component({
  selector: 'app-postulaciones',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <main class="feature-page">
      <section class="page-header">
        <h1>Postulaciones</h1>
        <p *ngIf="isEstudiante">Revisa tus postulaciones y sigue su estado.</p>
        <p *ngIf="isDocente">Revisa las postulaciones recibidas para tus convocatorias.</p>
        <p *ngIf="isAdmin">Consulta todas las postulaciones registradas en el sistema.</p>
      </section>

      <section *ngIf="isEstudiante || isDocente" class="postulaciones-panel">
        <mat-card>
          <mat-card-title>Postulaciones activas</mat-card-title>
          <table mat-table [dataSource]="postulaciones" class="mat-elevation-z2">
            <ng-container matColumnDef="convocatoria">
              <th mat-header-cell *matHeaderCellDef>Convocatoria</th>
              <td mat-cell *matCellDef="let item">{{ item.convocatoria }}</td>
            </ng-container>
            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let item">{{ item.estado }}</td>
            </ng-container>
            <ng-container matColumnDef="fecha">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let item">{{ item.fecha }}</td>
            </ng-container>
            <ng-container matColumnDef="accion">
              <th mat-header-cell *matHeaderCellDef>Acción</th>
              <td mat-cell *matCellDef="let item">
                <button mat-button color="primary" *ngIf="isEstudiante" (click)="viewConvocatoria(item.convocatoria)">Ver convocatoria</button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card>
      </section>

      <section class="info-panel" *ngIf="isEstudiante">
        <mat-card>
          <mat-card-title>¿Quieres postularte?</mat-card-title>
          <p>Visita la sección de convocatorias para encontrar oportunidades abiertas.</p>
          <button mat-flat-button color="primary" routerLink="/convocatorias">Ir a convocatorias</button>
        </mat-card>
      </section>

      <section class="info-panel" *ngIf="isAdmin">
        <mat-card>
          <mat-card-title>Acceso administrativo</mat-card-title>
          <p>Como administrador puedes ver todas las postulaciones registradas en el sistema.</p>
        </mat-card>
      </section>
    </main>
  `,
  styles: [
    `
      .feature-page { padding: 1.5rem; display: grid; gap: 1.5rem; }
      .page-header h1 { margin: 0; }
      .postulaciones-panel table { width: 100%; }
      .info-panel { display: grid; gap: 1rem; }
    `
  ]
})
export class PostulacionesComponent {
  private readonly authService = inject(AuthService);

  readonly userRole = this.authService.getUserRole();

  readonly postulaciones: Postulacion[] = [
    {
      id: 1,
      convocatoria: 'Beca de investigación 2026',
      estado: 'En revisión',
      fecha: '2026-06-20',
      solicitante: 'Ana Pérez'
    },
    {
      id: 2,
      convocatoria: 'Monitoreo académico semestre II',
      estado: 'Aceptada',
      fecha: '2026-06-03',
      solicitante: 'Carlos Gómez'
    }
  ];

  readonly displayedColumns = ['convocatoria', 'estado', 'fecha', 'accion'];

  get isAdmin(): boolean {
    return this.userRole === 'ADMINISTRADOR';
  }

  get isDocente(): boolean {
    return this.userRole === 'DOCENTE';
  }

  get isEstudiante(): boolean {
    return this.userRole === 'ESTUDIANTE';
  }

  viewConvocatoria(convocatoria: string): void {
    // placeholder para mostrar detalles o redirigir a convocatorias
  }
}
