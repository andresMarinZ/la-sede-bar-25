import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';
import { MenuService } from '../../core/services/menu.service';
import type { MenuItem, MenuGroup } from '../../core/models/menu-item.model';

interface MenuState {
  groups: MenuGroup[];
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: MenuState = { groups: [], loading: true, error: null };

const CATEGORIA_ICONS: Record<string, string> = {
  'Aguardiente': '🥃',
  'Ron':         '🍹',
  'Licores':     '🍾',
  'Bebidas':     '🥤',
  'Cerveza':     '🍺',
  'Snacks':      '🍟',
  'Otros':       '✨',
};

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.scss',
})
export class CartaComponent {
  private menuService = inject(MenuService);

  getIcon(categoria: string): string {
    return CATEGORIA_ICONS[categoria] ?? '🍸';
  }

  private state = toSignal(
    this.menuService.getMenu().pipe(
      map((items): MenuState => {
        const grouped = new Map<string, MenuItem[]>();
        for (const item of items) {
          if (!grouped.has(item.Categoria)) grouped.set(item.Categoria, []);
          grouped.get(item.Categoria)!.push(item);
        }
        const groups: MenuGroup[] = Array.from(grouped.entries()).map(
          ([categoria, productos]) => ({ categoria, productos })
        );
        return { groups, loading: false, error: null };
      }),
      startWith(INITIAL_STATE),
      catchError(() =>
        of({ groups: [], loading: false, error: 'No se pudo cargar el menú.' } as MenuState)
      )
    ),
    { initialValue: INITIAL_STATE }
  );

  isLoading = computed(() => this.state().loading);
  hasError  = computed(() => this.state().error);
  groups    = computed(() => this.state().groups);
}
