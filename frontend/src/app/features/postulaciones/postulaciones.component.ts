import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { PostulacionesService, PostulacionEntity } from '../../core/services/postulaciones.service';
import { UsuariosService, UsuarioEntity } from '../../core/services/usuarios.service';
import { ConvocatoriasService, ConvocatoriaEntity } from '../../core/services/convocatorias.service';

interface Postulacion {
  id: number;
  convocatoriaId: number;
  convocatoria: string;
  estado: string;
  fecha: string;
  solicitante: string;
}

@Component({
  selector: 'app-postulaciones',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './postulaciones.component.html',
  styleUrl: './postulaciones.component.scss'
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
  convocatorias: ConvocatoriaEntity[] = [];

  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    forkJoin({
      usuarios: this.usuariosService.listar(),
      convocatorias: this.convocatoriasService.listar(),
      postulaciones: this.postulacionesService.listar()
    }).subscribe(({ usuarios, convocatorias, postulaciones }) => {
      this.usuarios = usuarios;
      this.convocatorias = convocatorias;
      this.postulaciones = postulaciones.map((item) => {
        const conv = convocatorias.find((c) => c.id === item.convocatoriaId);
        const user = usuarios.find((u) => u.id === item.usuarioId);
        return {
          id: item.id,
          convocatoriaId: item.convocatoriaId,
          convocatoria: conv?.nombre ?? `Convocatoria #${item.convocatoriaId}`,
          estado: item.estado,
          fecha: item.fechaPostulacion,
          solicitante: user?.nombre ?? 'Desconocido'
        };
      });
      this.displayedColumns = this.isAdmin || this.isDocente
        ? ['convocatoria', 'solicitante', 'estado', 'fecha']
        : ['convocatoria', 'estado', 'fecha'];
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
