import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlueprintsService } from 'src/app/services/blueprints.service';
import { Modal } from 'bootstrap';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blueprints',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blueprints.component.html',
  styleUrl: './blueprints.component.scss',
})
export class BlueprintsComponent {
  static PATH: string = 'blueprints';

  private blueprintsService = inject(BlueprintsService);
  private http = inject(HttpClient);

  filterRaw = signal<string>('');
  filter = computed(() => this.filterRaw().trim().toLowerCase());

  blueprints = this.blueprintsService.blueprints;

  filteredBlueprints = computed(() => {
    if (this.filter().length === 0) return this.blueprints();
    return this.blueprints().filter((a) =>
      a().displayName.toLowerCase().includes(this.filter())
    );
  });

  onFilterChanged(newValue: string) {
    this.filterRaw.set(newValue);
  }

  delete(id: number) {
    this.blueprintsService.delete(id);
  }

  scriptForm = new FormGroup({
    name: new FormControl('test', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    script: new FormControl<File | null>(null, {
      validators: [Validators.required],
    }),
  });

  canSubmit = toSignal(
    this.scriptForm.statusChanges.pipe(
      takeUntilDestroyed(),
      map(() => this.scriptForm.valid)
    ),
    { initialValue: false }
  );

  openModal(modalEl: HTMLElement) {
    const modal = Modal.getOrCreateInstance(modalEl);
    modal?.show();
  }

  onFileSelect(fl: FileList | null) {
    if (fl == null || fl.length <= 0) {
      return;
    }
    this.scriptForm.controls.script.patchValue(fl[0]);
  }

  onSubmit(form: HTMLFormElement, modalEl: HTMLElement) {
    const formGroup = this.scriptForm;
    this.http.post(`/api/scripts`, new FormData(form)).subscribe({
      next() {
        console.log('success');
        const modal = Modal.getInstance(modalEl);
        modal?.hide();
        form.reset();
        formGroup.reset();
      },
      // TODO: maybe show a popup
      error(err) {
        console.log('error while uploading script: ', err);
      },
    });
  }
}
