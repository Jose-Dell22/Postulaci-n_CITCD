import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../core/services/auth.service';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  codigoDocente?: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <main class="feature-page">
      <section class="page-header">
        <h1>Usuarios</h1>
        <p>Administra los usuarios registrados y elimina cuentas cuando sea necesario.</p>
      </section>

      <section *ngIf="isAdmin" class="users-panel">
        <mat-card>
          <table mat-table [dataSource]="usuarios" class="mat-elevation-z2">
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let usuario">{{ usuario.nombre }}</td>
            </ng-container>
            <ng-container matColumnDef="correo">
              <th mat-header-cell *matHeaderCellDef>Correo</th>
              <td mat-cell *matCellDef="let usuario">{{ usuario.correo }}</td>
            </ng-container>
            <ng-container matColumnDef="rol">
              <th mat-header-cell *matHeaderCellDef>Rol</th>
              <td mat-cell *matCellDef="let usuario">{{ usuario.rol }}</td>
            </ng-container>
            <ng-container matColumnDef="codigoDocente">
              <th mat-header-cell *matHeaderCellDef>Código docente</th>
              <td mat-cell *matCellDef="let usuario">{{ usuario.codigoDocente || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let usuario">
                <button mat-icon-button color="warn" (click)="deleteUser(usuario.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card>
      </section>

      <section *ngIf="!isAdmin" class="access-panel">
        <mat-card>
          <mat-card-content>
            <p>No tienes permiso para ver esta sección. Solo el administrador puede gestionar usuarios.</p>
            <button mat-flat-button color="primary" routerLink="/dashboard">Regresar al dashboard</button>
          </mat-card-content>
        </mat-card>
      </section>
    </main>
  `,
  styles: [
    `
      .feature-page { padding: 1.5rem; display: grid; gap: 1rem; }
      .page-header h1 { margin: 0; }
      table { width: 100%; }
      .access-panel { max-width: 720px; }
    `
  ]
})
export class UsuariosComponent {
  private readonly authService = inject(AuthService);

  readonly userRole = this.authService.getUserRole();

  readonly usuarios: Usuario[] = [
    { id: 1, nombre: 'Admin Principal', correo: 'admin@usco.edu.co', rol: 'ADMINISTRADOR' },
    { id: 2, nombre: 'Docente María', correo: 'maria@usco.edu.co', rol: 'DOCENTE', codigoDocente: 'DOC001' },
    { id: 3, nombre: 'Estudiante Juan', correo: 'juan@usco.edu.co', rol: 'ESTUDIANTE' }
  ];

  readonly displayedColumns = ['nombre', 'correo', 'rol', 'codigoDocente', 'acciones'];

  get isAdmin(): boolean {
    return this.userRole === 'ADMINISTRADOR';
  }

  deleteUser(id: number): void {
    this.usuarios.splice(this.usuarios.findIndex((user) => user.id === id), 1);
  }
}
