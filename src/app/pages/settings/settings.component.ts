import { Component } from '@angular/core';
import { ThemeSelectorComponent } from 'src/app/components/settings/theme-selector/theme-selector.component';
import { WifiFormComponent } from 'src/app/components/settings/wifi-form/wifi-form.component';

@Component({
  standalone: true,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  imports: [WifiFormComponent, ThemeSelectorComponent],
})
export class SettingsComponent {
  static PATH: string = 'settings';
}
