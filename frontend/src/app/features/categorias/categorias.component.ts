import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink],
  template: `
    <main class="feature-page">
      <mat-card>
        <mat-card-title>Categorías</mat-card-title>
        <mat-card-content>
          <p>Administra categorías del sistema. Esta sección está pensada para el administrador.</p>
          <ul>
            <li>Investigación</li>
            <li>Monitoreo</li>
            <li>Capacitación</li>
          </ul>
          <button mat-flat-button color="primary" routerLink="/dashboard">Volver al dashboard</button>
        </mat-card-content>
      </mat-card>
    </main>
  `,
  styles: [
    `
      .feature-page { padding: 1.5rem; display: flex; justify-content: center; }
      mat-card { width: 100%; max-width: 720px; }
      ul { padding-left: 1.2rem; }
    `
  ]
})
export class CategoriasComponent {}
