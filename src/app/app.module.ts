import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ThemeSelectorComponent } from './components/settings/theme-selector/theme-selector.component';
import { WifiFormComponent } from './components/settings/wifi-form/wifi-form.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    ThemeSelectorComponent,
    WifiFormComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
