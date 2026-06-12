import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../core/services/auth.service';
import { PostulacionesService, PostulacionEntity } from '../../core/services/postulaciones.service';
import { UsuariosService, UsuarioEntity } from '../../core/services/usuarios.service';
import { ConvocatoriasService } from '../../core/services/convocatorias.service';

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

      <section *ngIf="(isEstudiante || isDocente) && postulaciones.length > 0" class="postulaciones-panel">
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

      <section class="info-panel" *ngIf="isEstudiante && postulaciones.length === 0">
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
export class PostulacionesComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly postulacionesService = inject(PostulacionesService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly convocatoriasService = inject(ConvocatoriasService);

  readonly userRole = this.authService.getUserRole();
  readonly userEmail = this.authService.getUserEmail();

  postulaciones: Postulacion[] = [];
  usuarios: UsuarioEntity[] = [];

  readonly displayedColumns = ['convocatoria', 'estado', 'fecha', 'accion'];

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.usuariosService.listar().subscribe((users) => {
      this.usuarios = users;
      this.fetchPostulaciones();
    });
  }

  private fetchPostulaciones(): void {
    this.postulacionesService.listar().subscribe((items) => {
      this.postulaciones = items.map((item) => ({
        id: item.id,
        convocatoria: `Convocatoria #${item.convocatoriaId}`,
        estado: item.estado,
        fecha: item.fechaPostulacion,
        solicitante: this.usuarios.find((usuario) => usuario.id === item.usuarioId)?.nombre ?? 'Desconocido'
      }));
    });
  }

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
    console.log('Ver convocatoria', convocatoria);
  }
}
