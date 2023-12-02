import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { WifiCredentials } from '../../models/wifi-credentials';

const prefix = isDevMode() ? 'http://localhost:8080/' : 'api/';

@Injectable({
  providedIn: 'root',
})
export class WifiCredentialsService {
  private http = inject(HttpClient);

  get(stop$: Subject<any>) {
    return this.http
      .get<WifiCredentials>(`${prefix}wifi-config`)
      .pipe(takeUntil(stop$));
  }
}
