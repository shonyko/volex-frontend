import { Injectable, computed, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private htmlContainer = document.querySelector('html') as HTMLHtmlElement;

  private persistedTheme = signal(localStorage.getItem('theme') ?? 'system');

  private systemDarkTheme = signal(
    window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  private theme = computed(() => {
    if (this.persistedTheme() == 'system') {
      return this.systemDarkTheme() ? 'dark' : 'light';
    }

    return this.persistedTheme();
  });

  activeTheme = this.persistedTheme.asReadonly();

  constructor() {
    effect(() => {
      this.htmlContainer.setAttribute('data-bs-theme', this.theme());
    });
  }

  set(theme: string) {
    this.persistedTheme.set(theme);
    localStorage.setItem('theme', theme);
  }

  init() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        this.systemDarkTheme.set(event.matches);
      });
  }
}
