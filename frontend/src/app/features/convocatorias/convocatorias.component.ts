import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';

interface Convocatoria {
  id: number;
  titulo: string;
  categoria: string;
  fechaLimite: string;
  estado: string;
  descripcion: string;
}

@Component({
  selector: 'app-convocatorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <main class="feature-page">
      <section class="page-header">
        <h1>Convocatorias</h1>
        <p *ngIf="isAdmin">Visualiza todas las convocatorias activas e inactivas del sistema.</p>
        <p *ngIf="isDocente && !isAdmin">Crea y administra tus convocatorias, o postula a las que están abiertas.</p>
        <p *ngIf="isEstudiante">Explora convocatorias activas y postúlate a las oportunidades disponibles.</p>
      </section>

      <section *ngIf="isAdmin || isDocente" class="create-panel">
        <mat-card>
          <mat-card-title>Crear nueva convocatoria</mat-card-title>
          <form [formGroup]="createForm" (ngSubmit)="onCreateConvocatoria()">
            <mat-form-field appearance="outline">
              <mat-label>Título</mat-label>
              <input matInput formControlName="titulo" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Categoría</mat-label>
              <input matInput formControlName="categoria" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Fecha límite</mat-label>
              <input matInput type="date" formControlName="fechaLimite" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Descripción</mat-label>
              <input matInput formControlName="descripcion" />
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="createForm.invalid">
              {{ isAdmin ? 'Crear convocatoria' : 'Crear convocatoria' }}
            </button>
          </form>
        </mat-card>
      </section>

      <section class="list-panel">
        <mat-card *ngFor="let convocatoria of convocatorias" class="convocatoria-card">
          <mat-card-header>
            <div mat-card-avatar class="icon-holder">
              <mat-icon>campaign</mat-icon>
            </div>
            <mat-card-title>{{ convocatoria.titulo }}</mat-card-title>
            <mat-card-subtitle>{{ convocatoria.categoria }} · {{ convocatoria.estado }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ convocatoria.descripcion }}</p>
            <p class="meta">Fecha límite: {{ convocatoria.fechaLimite }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-stroked-button color="primary" *ngIf="isEstudiante || isDocente" (click)="apply(convocatoria)">
              Postularme
            </button>
            <button mat-stroked-button color="warn" *ngIf="isAdmin" (click)="removeConvocatoria(convocatoria.id)">
              Eliminar
            </button>
          </mat-card-actions>
        </mat-card>
      </section>

      <section *ngIf="appliedIds.size > 0" class="applied-panel">
        <mat-card>
          <mat-card-title>Convocatorias a las que te has postulado</mat-card-title>
          <ul>
            <li *ngFor="let convocatoria of convocatorias">
              <span *ngIf="appliedIds.has(convocatoria.id)">{{ convocatoria.titulo }}</span>
            </li>
          </ul>
        </mat-card>
      </section>
    </main>
  `,
  styles: [
    `
      .feature-page { padding: 1.5rem; display: grid; gap: 1.5rem; }
      .page-header h1 { margin: 0 0 0.5rem; }
      .create-panel, .list-panel, .applied-panel { display: grid; gap: 1rem; }
      .convocatoria-card { width: 100%; }
      .meta { color: rgba(0,0,0,.6); margin-top: 0.5rem; }
      .icon-holder { background: rgba(21, 101, 192, 0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    `
  ]
})
export class ConvocatoriasComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly userRole = this.authService.getUserRole();

  readonly createForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    fechaLimite: ['', [Validators.required]],
    descripcion: ['', [Validators.required]]
  });

  readonly convocatorias: Convocatoria[] = [
    {
      id: 1,
      titulo: 'Beca de investigación 2026',
      categoria: 'Investigación',
      fechaLimite: '2026-07-15',
      estado: 'Abierta',
      descripcion: 'Convocatoria abierta para estudiantes y docentes interesados en proyectos de investigación.'
    },
    {
      id: 2,
      titulo: 'Monitoreo académico semestre II',
      categoria: 'Monitoreo',
      fechaLimite: '2026-08-01',
      estado: 'Cerrada',
      descripcion: 'Convocatoria cerrada para monitoreos académicos en diferentes facultades.'
    }
  ];

  readonly appliedIds = new Set<number>();

  get isAdmin(): boolean {
    return this.userRole === 'ADMINISTRADOR';
  }

  get isDocente(): boolean {
    return this.userRole === 'DOCENTE';
  }

  get isEstudiante(): boolean {
    return this.userRole === 'ESTUDIANTE';
  }

  apply(convocatoria: Convocatoria): void {
    this.appliedIds.add(convocatoria.id);
  }

  onCreateConvocatoria(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const raw = this.createForm.getRawValue();
    const nextId = Math.max(...this.convocatorias.map((c) => c.id), 0) + 1;

    this.convocatorias.unshift({
      id: nextId,
      titulo: raw.titulo,
      categoria: raw.categoria,
      fechaLimite: raw.fechaLimite,
      estado: 'Abierta',
      descripcion: raw.descripcion
    });

    this.createForm.reset({ titulo: '', categoria: '', fechaLimite: '', descripcion: '' });
  }

  removeConvocatoria(id: number): void {
    this.convocatorias.splice(this.convocatorias.findIndex((c) => c.id === id), 1);
    this.appliedIds.delete(id);
  }
}
