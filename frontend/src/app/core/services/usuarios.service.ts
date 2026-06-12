import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UsuarioEntity {
  id: number;
  identificacion: string;
  nombre: string;
  correo: string;
  rol: string;
  codigoDocente?: string;
  estado?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<UsuarioEntity[]> {
    return this.http.get<UsuarioEntity[]>(this.baseUrl);
  }

  getCurrentUser(correo: string): Observable<UsuarioEntity | undefined> {
    return this.listar().pipe(
      map((usuarios) => usuarios.find((usuario) => usuario.correo === correo))
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
