import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { CategoriasService, CategoriaEntity } from '../../core/services/categorias.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly categoriasService = inject(CategoriasService);

  readonly userRole = this.authService.getUserRole();

  categorias: CategoriaEntity[] = [];
  loading = false;

  readonly displayedColumns = ['nombre', 'descripcion', 'acciones'];

  ngOnInit(): void {
    this.cargarCategorias();
  }

  private cargarCategorias(): void {
    this.loading = true;
    this.categoriasService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
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

  deleteCategoria(categoria: CategoriaEntity): void {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }
    this.categoriasService.eliminar(categoria.id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter((c) => c.id !== categoria.id);
      }
    });
  }
}
