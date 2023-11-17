import { Component, OnInit, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
})
export class ThemeSelectorComponent implements OnInit {
  htmlContainer!: HTMLHtmlElement;
  darkMode = signal(false);

  ngOnInit(): void {
    this.htmlContainer = document.querySelector('html') as HTMLHtmlElement;
    this.darkMode.update(
      (_) => this.htmlContainer.getAttribute('data-bs-theme') === 'dark'
    );
  }

  toggleDarkMode() {
    const theme = this.darkMode() ? 'light' : 'dark';
    this.darkMode.update((val) => !val);
    this.htmlContainer.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
