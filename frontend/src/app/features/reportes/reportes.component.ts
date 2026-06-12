import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { ReportesService } from '../../core/services/reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <main class="feature-page">
      <section class="page-header">
        <h1>Reportes</h1>
        <p *ngIf="isAdmin">Accede a métricas de usuarios, convocatorias y postulaciones.</p>
        <p *ngIf="isDocente">Revisa reportes de convocatorias y desempeño de postulaciones.</p>
        <p *ngIf="isEstudiante">Solo los docentes y administradores pueden ver reportes detallados.</p>
      </section>

      <section *ngIf="!isEstudiante" class="cards-grid">
        <mat-card class="report-card">
          <mat-card-header>
            <mat-icon>bar_chart</mat-icon>
            <mat-card-title>Convocatorias activas</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ convocatoriasActivas }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="report-card">
          <mat-card-header>
            <mat-icon>assignment_turned_in</mat-icon>
            <mat-card-title>Postulaciones recibidas</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ postulacionesTotales }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="report-card">
          <mat-card-header>
            <mat-icon>people</mat-icon>
            <mat-card-title>Usuarios activos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ usuariosActivos }}</p>
          </mat-card-content>
        </mat-card>
      </section>

      <section *ngIf="isEstudiante" class="message-panel">
        <mat-card>
          <mat-card-content>
            <p>Para acceder a reportes necesitas ser docente o administrador.</p>
            <button mat-flat-button color="primary" routerLink="/convocatorias">Ver convocatorias</button>
          </mat-card-content>
        </mat-card>
      </section>
    </main>
  `,
  styles: [
    `
      .feature-page { padding: 1.5rem; display: grid; gap: 1.5rem; }
      .page-header h1 { margin: 0; }
      .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
      .report-card { padding: 1rem; }
      .report-card mat-icon { margin-right: 0.5rem; vertical-align: middle; }
      .message-panel { max-width: 720px; }
    `
  ]
})
export class ReportesComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly reportesService = inject(ReportesService);

  readonly userRole = this.authService.getUserRole();

  convocatoriasActivas = 'Cargando...';
  postulacionesTotales = 'Cargando...';
  usuariosActivos = 'Cargando...';

  ngOnInit(): void {
    this.loadReportes();
  }

  private loadReportes(): void {
    this.reportesService.contarConvocatoriasActivas().subscribe((count) => {
      this.convocatoriasActivas = `${count} convocatorias abiertas actualmente.`;
    });
    this.reportesService.contarPostulaciones().subscribe((count) => {
      this.postulacionesTotales = `${count} postulaciones registradas.`;
    });
    this.reportesService.contarUsuariosActivos().subscribe((count) => {
      this.usuariosActivos = `${count} usuarios activos en el sistema.`;
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
}
