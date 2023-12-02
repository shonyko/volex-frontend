import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from 'src/app/services/settings/theme.service';

@Component({
  standalone: true,
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
  imports: [ReactiveFormsModule],
})
export class ThemeSelectorComponent {
  private themeService = inject(ThemeService);

  themeCtrl = new FormControl<string>(this.themeService.activeTheme(), {
    nonNullable: true,
  });

  constructor() {
    this.themeCtrl.valueChanges.pipe(takeUntilDestroyed()).subscribe((val) => {
      this.themeService.set(val);
    });
  }
}
