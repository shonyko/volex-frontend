import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component, signal, computed, inject, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs';

import { WifiCredentialsService } from 'src/app/services/settings/wifi-credentials.service';

@Component({
  standalone: true,
  selector: 'app-wifi-form',
  templateUrl: './wifi-form.component.html',
  styleUrl: './wifi-form.component.scss',
  imports: [ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WifiFormComponent {
  private wifiService = inject(WifiCredentialsService);

  showPass = signal(false);
  icon = computed(() => (this.showPass() ? 'bi-eye-slash' : 'bi-eye'));
  type = computed(() => (this.showPass() ? 'text' : 'password'));

  togglePass() {
    this.showPass.update((val) => !val);
  }

  creds = this.wifiService.credentials;

  form = new FormGroup({
    ssid: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    pass: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  isDisabled$ = this.form.valueChanges.pipe(
    takeUntilDestroyed(),
    map((_) => this.form.invalid || this.form.pristine)
  );

  constructor() {
    effect(() => {
      this.form.setValue(this.creds());
    });
  }

  onSubmit() {
    // TODO: maybe add loading animation
    this.wifiService.update(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.markAsPristine();
        console.log('success');
      },
      error() {},
    });
  }
}
