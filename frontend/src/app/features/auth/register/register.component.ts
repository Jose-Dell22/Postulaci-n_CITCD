import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  errorMessage = '';
  isSubmitting = false;

  readonly form = this.fb.nonNullable.group({
    identificacion: ['', [Validators.required, Validators.pattern(/^[^\d]+$/)]],
    nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    codigoDocente: ['']
  });

  constructor() {
    if (this.authService.getToken()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const raw = this.form.getRawValue();
    const request: any = {
      identificacion: raw.identificacion,
      nombre: raw.nombre,
      correo: raw.correo,
      password: raw.password
    };
    if (raw.codigoDocente.trim()) {
      request.codigoDocente = raw.codigoDocente.trim();
    }

    this.authService.register(request).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.isSubmitting = false;
        this.errorMessage =
          'No fue posible completar el registro. Verifique los datos e intente nuevamente.';
      }
    });
  }
}
