import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConvocatoriasService, ConvocatoriaEntity } from '../../../core/services/convocatorias.service';

@Component({
  selector: 'app-detalle-convocatoria',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss'
})
export class ConvocatoriaDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly convocatoriasService = inject(ConvocatoriasService);

  convocatoria?: ConvocatoriaEntity;
  loading = true;
  error = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }
    this.convocatoriasService.obtenerPorId(id).subscribe({
      next: (data) => {
        this.convocatoria = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  estadoColor(estado: string): string {
    switch (estado) {
      case 'PUBLICADA': return 'primary';
      case 'BORRADOR': return 'accent';
      case 'CERRADA': return 'warn';
      default: return '';
    }
  }
}
