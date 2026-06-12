import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { ConvocatoriasService, ConvocatoriaEntity, ConvocatoriaCreateRequest } from '../../core/services/convocatorias.service';
import { UsuariosService, UsuarioEntity } from '../../core/services/usuarios.service';
import { PostulacionesService, PostulacionCreateRequest } from '../../core/services/postulaciones.service';

function fechaNoPasada(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return new Date(control.value) < hoy ? { fechaPasada: true } : null;
  };
}

function fechasValidas(group: AbstractControl): ValidationErrors | null {
  const inicio = group.get('fechaInicio')?.value;
  const fin = group.get('fechaLimite')?.value;
  if (!inicio || !fin) return null;
  return new Date(fin) <= new Date(inicio) ? { fechaFinInvalida: true } : null;
}

interface Convocatoria {
  id: number;
  titulo: string;
  categoria: string;
  fechaLimite: string;
  estado: string;
  descripcion: string;
  cupos: number;
  reportada?: boolean;
  motivoReporte?: string;
}

@Component({
  selector: 'app-convocatorias',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatCardModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule],
  templateUrl: './convocatorias.component.html',
  styleUrl: './convocatorias.component.scss'
})
export class ConvocatoriasComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly convocatoriasService = inject(ConvocatoriasService);
  private readonly postulacionesService = inject(PostulacionesService);
  private readonly usuariosService = inject(UsuariosService);

  readonly userRole = this.authService.getUserRole();
  readonly userEmail = this.authService.getUserEmail();

  readonly minDate = new Date().toISOString().split('T')[0];

  readonly createForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    categoria: ['', Validators.maxLength(100)],
    fechaInicio: [this.minDate, [Validators.required, fechaNoPasada()]],
    fechaLimite: ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
  }, { validators: fechasValidas });

  convocatorias: Convocatoria[] = [];
  appliedIds = new Set<number>();
  currentUser?: UsuarioEntity;

  ngOnInit(): void {
    this.loadUser();
    this.fetchConvocatorias();
  }

  private loadUser(): void {
    if (!this.userEmail) return;
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
        descripcion: item.descripcion,
        cupos: item.cuposDisponibles,
        reportada: item.reportada,
        motivoReporte: item.motivoReporte
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
    if (!this.currentUser) return;
    const request: PostulacionCreateRequest = {
      usuarioId: this.currentUser.id,
      convocatoriaId: convocatoria.id
    };
    this.postulacionesService.crear(request).subscribe({
      next: () => this.appliedIds.add(convocatoria.id),
      error: () => {}
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
      fechaInicio: raw.fechaInicio,
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
        descripcion: created.descripcion,
        cupos: created.cuposDisponibles
      });
      this.createForm.reset({ titulo: '', categoria: '', fechaInicio: this.minDate, fechaLimite: '', descripcion: '' });
    });
  }

  removeConvocatoria(id: number): void {
    this.convocatoriasService.eliminar(id).subscribe({
      next: () => {
        this.convocatorias = this.convocatorias.filter((c) => c.id !== id);
        this.appliedIds.delete(id);
      },
      error: () => {}
    });
  }

  reportarConvocatoria(c: Convocatoria): void {
    const motivo = prompt('Ingrese el motivo del reporte:');
    if (!motivo || motivo.trim() === '') return;
    this.convocatoriasService.reportar(c.id, motivo).subscribe({
      next: (updated) => {
        c.reportada = updated.reportada;
        c.motivoReporte = updated.motivoReporte;
      }
    });
  }

  desreportarConvocatoria(id: number): void {
    this.convocatoriasService.desreportar(id).subscribe({
      next: (updated) => {
        const c = this.convocatorias.find((x) => x.id === id);
        if (c) {
          c.reportada = updated.reportada;
          c.motivoReporte = updated.motivoReporte;
        }
      }
    });
  }
}
