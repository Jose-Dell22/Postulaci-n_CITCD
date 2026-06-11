export interface LoginRequest {
  correo: string;
  password: string;
}

export interface RegisterRequest {
  identificacion: string;
  nombre: string;
  correo: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface JwtPayload {
  sub: string;
  exp: number;
}
