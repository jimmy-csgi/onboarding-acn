import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  template: `
    <main class="wrap">
      <h1>{{ title() }}</h1>
      <p>Interpolation reads from the component (same idea as JSX: wrap the field in curly braces).</p>
      <p>Next: <code>ng serve learn-03-ng-model</code></p>
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
export class App {
  protected readonly title = signal('Angular learn — step 2 (interpolation)');
}
