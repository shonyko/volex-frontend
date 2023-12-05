import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WifiCredentials } from '../../models/wifi-credentials';
import { MockDataService } from '../mock-data.service';
import { useMockData } from 'src/app/utils/config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WifiCredentialsService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  private _credentials = signal<WifiCredentials>({
    ssid: '',
    pass: '',
  });

  get credentials() {
    return this._credentials.asReadonly();
  }

  constructor() {
    this.getData()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this._credentials.set(data);
      });
  }

  private getMockData() {
    return this.mockData.getCredentials();
  }

  private getServerData() {
    return this.http.get<WifiCredentials>(`/api/wifi-config`);
  }

  private getData() {
    return useMockData() ? this.getMockData() : this.getServerData();
  }

  update(new_creds: WifiCredentials) {
    // TODO: maybe show a popup
    return this.http.post('/api/wifi-config', new_creds).pipe(
      tap({
        next: () => {
          this._credentials.set(new_creds);
        },
        // TODO: maybe don't reset it (?)
        error: (err) => {
          console.log('error while updating wifi credentials: ', err);
          this._credentials.update((c) => ({ ...c }));
        },
      })
    );
  }
}
