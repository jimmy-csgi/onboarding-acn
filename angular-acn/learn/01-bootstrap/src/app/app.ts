import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  template: `
    <main class="wrap">
      <h1>Angular learn — step 1 (bootstrap)</h1>
      <p>If this page renders with no console errors, bootstrap worked.</p>
      <p>Next: <code>ng serve learn-02-interpolation</code></p>
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
      code {
        font-size: 0.9em;
      }
    `,
  ],
})
export class App {}
