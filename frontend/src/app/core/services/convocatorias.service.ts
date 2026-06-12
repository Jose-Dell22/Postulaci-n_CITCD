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
  reportada?: boolean;
  motivoReporte?: string;
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

  obtenerPorId(id: number): Observable<ConvocatoriaEntity> {
    return this.http.get<ConvocatoriaEntity>(`${this.baseUrl}/${id}`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  listarReportadas(): Observable<ConvocatoriaEntity[]> {
    return this.http.get<ConvocatoriaEntity[]>(`${this.baseUrl}/reportadas`);
  }

  reportar(id: number, motivo: string): Observable<ConvocatoriaEntity> {
    return this.http.put<ConvocatoriaEntity>(`${this.baseUrl}/${id}/reportar`, motivo);
  }

  desreportar(id: number): Observable<ConvocatoriaEntity> {
    return this.http.put<ConvocatoriaEntity>(`${this.baseUrl}/${id}/desreportar`, null);
  }
}
