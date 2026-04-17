import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AcnService } from './acn.service';
import { acnSubmitValidator } from './acn-check.validator';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <main class="wrap">
      <h1>Step 5 — reactive form + validate on Check</h1>
      <p class="note">
        <code>FormGroup</code> with <code>updateOn: 'submit'</code> runs validators when you submit (like RHF
        <code>mode: 'onSubmit'</code>). Use <code>form.valid</code> / <code>form.controls.acn.errors</code> instead of a
        hand-written <code>result()</code> signal.
      </p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>
          ACN:
          <input formControlName="acn" />
        </label>
        <button type="submit">Check</button>
      </form>
      @if (submitted() && form.valid) {
        <p class="ok">Valid ACN.</p>
      }
      @if (submitted() && form.invalid) {
        <p class="bad">Not a valid ACN (wrong length or check digit).</p>
      }
      <p class="meta">
        After Check: <code>form.valid = {{ form.valid }}</code>
        @if (form.controls.acn.errors; as err) {
          <span> · errors = {{ err | json }}</span>
        }
      </p>
      <p class="hint">Try <code>004 085 616</code> or <code>004085616</code></p>
      <p>Next: <code>ng serve learn-06-directive</code></p>
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
      code {
        font-size: 0.9em;
      }
      input {
        width: 100%;
        max-width: 22rem;
        margin: 0.35rem 0 0.75rem;
        font-size: 1rem;
        padding: 0.4rem 0.5rem;
      }
      button {
        margin-right: 0.5rem;
      }
      .ok {
        color: #065f46;
      }
      .bad {
        color: #991b1b;
      }
      .hint {
        color: #555;
        font-size: 0.9rem;
      }
      .meta {
        font-size: 0.8rem;
        color: #666;
        margin: 0.75rem 0 0;
        word-break: break-word;
      }
    `,
  ],
})
export class App {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly acnService = inject(AcnService);

  /** Validators run on form submit (not every keystroke). */
  protected readonly form = this.fb.group(
    {
      acn: this.fb.control('', {
        validators: [acnSubmitValidator(this.acnService)],
      }),
    },
    { updateOn: 'submit' },
  );

  /** True after user clicks Check (submit). */
  protected readonly submitted = signal(false);

  onSubmit(): void {
    this.submitted.set(true);
  }
}
