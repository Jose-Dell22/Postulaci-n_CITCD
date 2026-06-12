import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PostulacionEntity {
  id: number;
  usuarioId: number;
  convocatoriaId: number;
  estado: string;
  fechaPostulacion: string;
}

export interface PostulacionCreateRequest {
  usuarioId: number;
  convocatoriaId: number;
}

@Injectable({ providedIn: 'root' })
export class PostulacionesService {
  private readonly baseUrl = `${environment.apiUrl}/postulaciones`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<PostulacionEntity[]> {
    return this.http.get<PostulacionEntity[]>(this.baseUrl);
  }

  crear(request: PostulacionCreateRequest): Observable<PostulacionEntity> {
    return this.http.post<PostulacionEntity>(this.baseUrl, request);
  }
}
