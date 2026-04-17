import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  template: `
    <main class="wrap">
      <h1>Step 3 — ngModel + signal</h1>
      <label>
        Type anything:
        <input [ngModel]="acn()" (ngModelChange)="acn.set($event)" />
      </label>
      <p>Live: <strong>{{ acn() }}</strong></p>
      <p>Next: <code>ng serve learn-04-service</code></p>
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
        max-width: 20rem;
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
  protected readonly acn = signal('');
}
