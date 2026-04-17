import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AcnService } from './acn.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  template: `
    <main class="wrap">
      <h1>Step 4 — injectable service</h1>
      <label>
        ACN (with or without spaces):
        <input [ngModel]="raw()" (ngModelChange)="raw.set($event)" />
      </label>
      <p>Normalized (spaces only stripped): <strong>{{ normalized() }}</strong></p>
      <p>Digits-only model (via service): <strong>{{ digits() }}</strong></p>
      <p>Next: <code>ng serve learn-05-validate</code></p>
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
      input {
        width: 100%;
        max-width: 22rem;
        margin-top: 0.35rem;
        font-size: 1rem;
        padding: 0.4rem 0.5rem;
      }
      code {
        font-size: 0.9em;
      }
    `,
  ],
})
export class App {
  private readonly acn = inject(AcnService);
  protected readonly raw = signal('');

  protected readonly normalized = computed(() => this.acn.normalize(this.raw()));
  protected readonly digits = computed(() => this.acn.parseModelDigits(this.raw()));
}
