import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import { formatAcnDisplay, isNineDigitAcn, normalizeAcnInput } from '../../../shared/acn';
import { acnLiveValidator } from './acn-live.validator';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    acn: this.fb.control('', { validators: [acnLiveValidator()] }),
  });

  // FormControl exposes valueChanges as an RxJS Observable (push stream), not a Signal.
  // toSignal() subscribes once and mirrors the latest value into a Signal so computed() can depend on it.
  // .pipe(...) chains RxJS operators on that Observable; startWith(...) emits the current value first so
  // we get one emission before the user types (otherwise the stream is quiet until the first change).
  private readonly acnValue = toSignal(
    this.form.controls.acn.valueChanges.pipe(startWith(this.form.controls.acn.value)),
    { initialValue: '' },
  );

  protected readonly normalized = computed(() => normalizeAcnInput(this.acnValue() ?? ''));

  protected readonly formatted = computed(() => {
    const n = this.normalized();
    return isNineDigitAcn(n) ? formatAcnDisplay(n) : n;
  });

  /** For template: valid ACN banner only when control is valid and we have nine digits (not empty-valid). */
  protected readonly showValidBanner = computed(() => {
    const n = this.normalized();
    return this.form.controls.acn.valid && isNineDigitAcn(n);
  });
}
