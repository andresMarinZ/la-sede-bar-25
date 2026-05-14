import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { SedeService } from '../../core/services/sede.service';
import { EventoService } from '../../core/services/evento.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private sedeService  = inject(SedeService);
  private eventoService = inject(EventoService);

  sede = toSignal(
    this.sedeService.getSede().pipe(catchError(() => of(null))),
    { initialValue: null }
  );

  evento = toSignal(
    this.eventoService.getEvento().pipe(catchError(() => of(null))),
    { initialValue: null }
  );

  whatsappUrl = computed(
    () => `https://wa.me/${this.sede()?.whatsapp ?? '573125393316'}`
  );
}
