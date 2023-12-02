import { Injectable, inject, isDevMode, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WifiCredentials } from '../../models/wifi-credentials';

const prefix = isDevMode() ? 'http://localhost:8080/' : 'api/';

@Injectable({
  providedIn: 'root',
})
export class WifiCredentialsService {
  private http = inject(HttpClient);

  private _credentials = signal<WifiCredentials>({
    ssid: '',
    pass: '',
  });

  get credentials() {
    return this._credentials.asReadonly();
  }

  constructor() {
    setTimeout(() => {
      this._credentials.set({
        ssid: 'test',
        pass: 'haha',
      });
    }, 1000);
  }

  update(new_creds: WifiCredentials) {
    // TODO: send to backend
    console.log(new_creds);
  }

  get() {
    return this.http.get<WifiCredentials>(`${prefix}wifi-config`);
  }
}
