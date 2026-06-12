import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { UsuariosService, UsuarioEntity } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly usuariosService = inject(UsuariosService);

  readonly userRole = this.authService.getUserRole();

  usuarios: UsuarioEntity[] = [];
  loading = false;

  readonly displayedColumns = ['nombre', 'correo', 'rol', 'codigoDocente', 'estado', 'acciones'];

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    this.loading = true;
    this.usuariosService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get isAdmin(): boolean {
    return this.userRole === 'ADMINISTRADOR';
  }

  deleteUser(usuario: UsuarioEntity): void {
    if (!confirm(`¿Estás seguro de eliminar a "${usuario.nombre}"?`)) {
      return;
    }
    this.usuariosService.eliminar(usuario.id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
      }
    });
  }
}
