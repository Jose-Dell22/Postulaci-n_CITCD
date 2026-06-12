import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { ConvocatoriasService, ConvocatoriaEntity, ConvocatoriaCreateRequest } from '../../core/services/convocatorias.service';
import { UsuariosService, UsuarioEntity } from '../../core/services/usuarios.service';
import { PostulacionesService, PostulacionCreateRequest } from '../../core/services/postulaciones.service';

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
              Crear convocatoria
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
export class ConvocatoriasComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly convocatoriasService = inject(ConvocatoriasService);
  private readonly postulacionesService = inject(PostulacionesService);
  private readonly usuariosService = inject(UsuariosService);

  readonly userRole = this.authService.getUserRole();
  readonly userEmail = this.authService.getUserEmail();

  readonly createForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    fechaLimite: ['', [Validators.required]],
    descripcion: ['', [Validators.required]]
  });

  convocatorias: Convocatoria[] = [];
  appliedIds = new Set<number>();
  currentUser?: UsuarioEntity;

  ngOnInit(): void {
    this.loadUser();
    this.fetchConvocatorias();
  }

  private loadUser(): void {
    if (!this.userEmail) {
      return;
    }

    this.usuariosService.getCurrentUser(this.userEmail).subscribe((user) => {
      this.currentUser = user;
    });
  }

  private fetchConvocatorias(): void {
    this.convocatoriasService.listar().subscribe((items) => {
      this.convocatorias = items.map((item) => ({
        id: item.id,
        titulo: item.nombre,
        categoria: item.categorias?.[0]?.nombre ?? 'General',
        fechaLimite: item.fechaFin,
        estado: item.estado,
        descripcion: item.descripcion
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

  apply(convocatoria: Convocatoria): void {
    if (!this.currentUser) {
      return;
    }

    const request: PostulacionCreateRequest = {
      usuarioId: this.currentUser.id,
      convocatoriaId: convocatoria.id
    };

    this.postulacionesService.crear(request).subscribe({
      next: () => {
        this.appliedIds.add(convocatoria.id);
      },
      error: (error) => {
        console.error('Error al postularse', error);
      }
    });
  }

  onCreateConvocatoria(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const raw = this.createForm.getRawValue();
    const request: ConvocatoriaCreateRequest = {
      nombre: raw.titulo,
      descripcion: raw.descripcion,
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: raw.fechaLimite,
      cuposDisponibles: 10,
      estado: 'PUBLICADA',
      categoriaIds: []
    };

    this.convocatoriasService.crear(request).subscribe((created) => {
      this.convocatorias.unshift({
        id: created.id,
        titulo: created.nombre,
        categoria: created.categorias?.[0]?.nombre ?? 'General',
        fechaLimite: created.fechaFin,
        estado: created.estado,
        descripcion: created.descripcion
      });
      this.createForm.reset({ titulo: '', categoria: '', fechaLimite: '', descripcion: '' });
    });
  }

  removeConvocatoria(id: number): void {
    this.convocatoriasService.eliminar(id).subscribe({
      next: () => {
        this.convocatorias = this.convocatorias.filter((c) => c.id !== id);
        this.appliedIds.delete(id);
      },
      error: (error) => {
        console.error('Error al eliminar convocatoria', error);
      }
    });
  }
}
