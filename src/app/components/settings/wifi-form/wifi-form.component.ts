import {
  Component,
  ViewChild,
  ElementRef,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { Subject } from 'rxjs';
import { WifiCredentialsService } from 'src/app/services/wifi-credentials.service';

@Component({
  selector: 'app-wifi-form',
  templateUrl: './wifi-form.component.html',
  styleUrls: ['./wifi-form.component.scss'],
})
export class WifiFormComponent implements OnInit, OnDestroy {
  @ViewChild('pass') passField!: ElementRef;
  @ViewChild('form') form!: ElementRef;

  showPass = signal(false);
  icon = computed(() => (this.showPass() ? 'bi-eye-slash' : 'bi-eye'));
  newType = computed(() => (this.showPass() ? 'password' : 'text'));

  destroy$ = new Subject<boolean>();

  constructor(private wifiService: WifiCredentialsService) {}

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
