import { Component, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { SedeService } from '../../core/services/sede.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss',
})
export class ContactoComponent {
  private sanitizer  = inject(DomSanitizer);
  private sedeService = inject(SedeService);

  sede = toSignal(
    this.sedeService.getSede().pipe(catchError(() => of(null))),
    { initialValue: null }
  );

  // Sanitizamos la URL del iframe para que Angular no la bloquee.
  // Es seguro porque el origen es nuestro propio JSON (no input del usuario).
  mapUrl = computed((): SafeResourceUrl | null => {
    const url = this.sede()?.ubicacion.mapsEmbed;
    return url
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : null;
  });

  whatsappUrl = computed(
    () => `https://wa.me/${this.sede()?.whatsapp ?? '573125393316'}`
  );
}
