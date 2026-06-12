import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ReporteConteo {
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private readonly usuariosUrl = `${environment.apiUrl}/usuarios`;
  private readonly convocatoriasUrl = `${environment.apiUrl}/convocatorias`;
  private readonly postulacionesUrl = `${environment.apiUrl}/postulaciones`;

  constructor(private readonly http: HttpClient) {}

  contarUsuariosActivos(): Observable<number> {
    return this.http.get<any[]>(this.usuariosUrl).pipe(
      map((usuarios) => usuarios.filter((usuario) => usuario.estado).length)
    );
  }

  contarConvocatoriasActivas(): Observable<number> {
    return this.http.get<any[]>(this.convocatoriasUrl).pipe(
      map((convocatorias) => convocatorias.filter((convocatoria) => convocatoria.estado === 'PUBLICADA').length)
    );
  }

  contarPostulaciones(): Observable<number> {
    return this.http.get<any[]>(this.postulacionesUrl).pipe(
      map((postulaciones) => postulaciones.length)
    );
  }
}
