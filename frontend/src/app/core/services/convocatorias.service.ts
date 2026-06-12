import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConvocatoriaEntity {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  cuposDisponibles: number;
  estado: string;
  categorias?: Array<{ id: number; nombre: string }>;
}

export interface ConvocatoriaCreateRequest {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  cuposDisponibles: number;
  estado?: string;
  categoriaIds?: number[];
}

@Injectable({ providedIn: 'root' })
export class ConvocatoriasService {
  private readonly baseUrl = `${environment.apiUrl}/convocatorias`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<ConvocatoriaEntity[]> {
    return this.http.get<ConvocatoriaEntity[]>(this.baseUrl);
  }

  crear(request: ConvocatoriaCreateRequest): Observable<ConvocatoriaEntity> {
    return this.http.post<ConvocatoriaEntity>(this.baseUrl, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
