import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AcnDigitsOnlyDirective } from './acn-digits-only.directive';
import { AcnService } from './acn.service';
import { acnSubmitValidator } from './acn-check.validator';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, AcnDigitsOnlyDirective],
  template: `
    <main class="wrap">
      <h1>Step 6 — directive + reactive form</h1>
      <p class="note">
        <code>formControlName="acn"</code> on the same input as <code>appAcnDigitsOnly</code>. Digits-only model via
        <code>valueChanges</code>; Check uses the same submit-time validator as step 5.
      </p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>
          ACN:
          <input appAcnDigitsOnly formControlName="acn" />
        </label>
        <button type="submit">Check</button>
      </form>
      <p>Model: <strong>{{ form.controls.acn.value }}</strong></p>
      @if (submitted() && form.valid) {
        <p class="ok">Valid.</p>
      }
      @if (submitted() && form.invalid) {
        <p class="bad">Invalid.</p>
      }
      <p>Next: <code>ng serve learn-07-full</code></p>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: system-ui, sans-serif;
        padding: 2rem 1rem;
      }
      .wrap {
        max-width: 28rem;
        margin: 0 auto;
      }
      .note {
        font-size: 0.85rem;
        color: #444;
        margin: 0 0 1rem;
        line-height: 1.45;
      }
      input {
        width: 100%;
        max-width: 22rem;
        margin-top: 0.35rem;
        font-size: 1rem;
        padding: 0.4rem 0.5rem;
      }
      button {
        margin-top: 0.75rem;
      }
      .ok {
        color: #065f46;
      }
      .bad {
        color: #991b1b;
      }
      code {
        font-size: 0.9em;
      }
    `,
  ],
})
export class App {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly acnService = inject(AcnService);

  protected readonly form = this.fb.group(
    {
      acn: this.fb.control('', {
        validators: [acnSubmitValidator(this.acnService)],
      }),
    },
    { updateOn: 'submit' },
  );

  protected readonly submitted = signal(false);

  constructor() {
    // The directive only blocks bad *keys*; paste/context-menu can still insert letters.
    // Subscribe to every new control value, strip non-digits (same as old ngModelChange), write back if it changed.
    this.form.controls.acn.valueChanges
      .pipe(takeUntilDestroyed()) // auto-unsubscribe when this component is destroyed
      .subscribe((raw) => {
        const digits = this.acnService.parseModelDigits(raw ?? '');
        if (digits !== raw) {
          // Avoid re-entering this subscription in an infinite loop
          this.form.controls.acn.setValue(digits, { emitEvent: false });
          // Re-run validators against the cleaned value (e.g. after paste)
          this.form.controls.acn.updateValueAndValidity({ emitEvent: true });
        }
      });
  }

  onSubmit(): void {
    this.submitted.set(true);
  }
}
