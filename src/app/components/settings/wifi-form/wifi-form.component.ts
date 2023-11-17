import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  ElementRef,
  signal,
  computed,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';

import { Subject } from 'rxjs';
import { WifiCredentialsService } from 'src/app/services/wifi-credentials.service';

@Component({
  standalone: true,
  selector: 'app-wifi-form',
  templateUrl: './wifi-form.component.html',
  styleUrl: './wifi-form.component.scss',
  imports: [CommonModule],
})
export class WifiFormComponent implements OnInit, OnDestroy {
  @ViewChild('pass') passField!: ElementRef;
  @ViewChild('form') form!: ElementRef;

  private wifiService = inject(WifiCredentialsService);

  showPass = signal(false);
  icon = computed(() => (this.showPass() ? 'bi-eye-slash' : 'bi-eye'));
  newType = computed(() => (this.showPass() ? 'password' : 'text'));

  destroy$ = new Subject<boolean>();

  ngOnInit(): void {
    this.wifiService.get(this.destroy$).subscribe((credentials) => {
      console.log(credentials);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  togglePass() {
    this.passField.nativeElement.setAttribute('type', this.newType());
    this.showPass.update((val) => !val);
  }

  sendCredentials() {
    const form = this.form.nativeElement;
    var formData = new FormData(form);

    console.log('settings form', formData);
  }
}
