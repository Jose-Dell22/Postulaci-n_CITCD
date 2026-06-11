import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentYear = new Date().getFullYear();

  readonly features = [
    {
      icon: 'campaign',
      title: 'Convocatorias',
      description:
        'Consulte y administre convocatorias institucionales para eventos, becas, monitorías y más.'
    },
    {
      icon: 'assignment',
      title: 'Postulaciones',
      description:
        'Registre y haga seguimiento a sus postulaciones con estados claros en cada etapa.'
    },
    {
      icon: 'insights',
      title: 'Reportes',
      description:
        'Acceda a reportes por categoría y resultados para la toma de decisiones institucionales.'
    }
  ];

  constructor() {
    if (this.authService.getToken()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
