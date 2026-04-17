# Step 3 — Two-way binding (input ↔ state)

**AngularJS equivalent:** `ng-model="vm.acn"`.

**Runnable app:** `learn/03-ng-model` → `npx ng serve learn-03-ng-model`.

## Goal

Type in an `<input>` and **see the value update** in the template — a **controlled input**: the source of truth is your component state, and the DOM reflects it.

## Angular concepts

### `FormsModule` and `ngModel`

- Import **`FormsModule`** into the component’s **`imports`** array so **`ngModel`** is legal on `<input>`, `<textarea>`, etc.
- **`ngModel`** is Angular’s **directive** that knows how to listen to native input events and write back into your model.

### “Two-way” with signals: split binding (recommended)

Angular can write **`[(ngModel)]="prop"`** when `prop` is a **writable field**. With **signals**, the idiomatic pattern is **explicit**:

```html
<input [ngModel]="acn()" (ngModelChange)="acn.set($event)" />
```

| Piece | Meaning |
|--------|---------|
| **`[ngModel]="acn()"`** | **Property binding** (one-way into the directive): “current input text is whatever **`acn()`** returns.” |
| **`(ngModelChange)="acn.set($event)"`** | **Event binding**: whenever the input’s string changes, **push** the new string into the signal. |

Together they behave like **controlled `value` + `onChange`** in React: the **signal** is the source of truth; the input is a **projection** of it.

Why not only `(ngModelChange)`? You want the input to **re-render** correctly when you change the signal from **code** (e.g. reset button later), so the **one-way** `[ngModel]` read keeps DOM and state in sync.

### `protected readonly acn = signal('')`

Same visibility story as step 2: the **template** calls **`acn()`** and **`acn.set`**, so the field must be **`public` or `protected`** (not **`private`**). **`readonly`** prevents replacing the signal object. Details: **[deeper-angular-and-typescript.md](./deeper-angular-and-typescript.md)**.

### Example (matches runnable step 3)

**`app.ts`**

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  template: `
    <label>
      Type here:
      <input [ngModel]="acn()" (ngModelChange)="acn.set($event)" />
    </label>
    <p>Live: <strong>{{ acn() }}</strong></p>
  `,
})
export class App {
  protected readonly acn = signal('');
}
```

## React reference

| Angular | React |
|--------|--------|
| `[ngModel]` + `(ngModelChange)` | `value={acn}` + `onChange={(e) => setAcn(e.target.value)}` |
| `signal` + `acn()` / `acn.set` | `useState` |
| `{{ acn() }}` | `{acn}` |

**Takeaway:** **`ngModel` + signal** is the **controlled input** pattern: one state container, explicit read/write bindings.

---

**Dig deeper:** [Signals + template visibility](./deeper-angular-and-typescript.md)

← [Step 2](./step-02-interpolation.md) · [Overview](./README.md) · [Step 4 — Service](./step-04-service.md) →
