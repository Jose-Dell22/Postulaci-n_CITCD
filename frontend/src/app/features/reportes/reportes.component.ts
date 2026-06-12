import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../core/services/auth.service';
import { ReportesService } from '../../core/services/reportes.service';
import { ConvocatoriasService, ConvocatoriaEntity } from '../../core/services/convocatorias.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly reportesService = inject(ReportesService);
  private readonly convocatoriasService = inject(ConvocatoriasService);

  readonly userRole = this.authService.getUserRole();

  convocatoriasActivas = 'Cargando...';
  postulacionesTotales = 'Cargando...';
  usuariosActivos = 'Cargando...';

  reportadas: ConvocatoriaEntity[] = [];

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
    if (this.isAdmin) {
      this.convocatoriasService.listarReportadas().subscribe((data) => {
        this.reportadas = data;
      });
    }
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

  atenderReporte(id: number): void {
    this.convocatoriasService.desreportar(id).subscribe({
      next: () => {
        this.reportadas = this.reportadas.filter((r) => r.id !== id);
      }
    });
  }
}
