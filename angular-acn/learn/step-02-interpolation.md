# Step 2 — Show data from the component (`{{ }}`)

**AngularJS equivalent:** `ng-controller` + `{{ vm.message }}`.

**Runnable app:** `learn/02-interpolation` → `npx ng serve learn-02-interpolation`.

## Goal

Display a value from the **component class** in the template using **interpolation** — the same “print this in the UI” idea as **`{value}`** in JSX.

## Angular concepts

### Interpolation

- **`{{ expression }}`** evaluates `expression` in the **context of the component instance** and converts the result to a string (roughly like AngularJS).
- The expression can be a **property**, a **method call**, or a **signal read** (see below).

### Plain field vs `signal`

- A **plain field** like `protected readonly title = 'Hello';` works with **`{{ title }}`** — no parentheses.
- A **`Signal`** is an object; you read its current value with **`title()`** in the template: **`{{ title() }}`**. That is why step 2’s runnable app often uses **`signal`** early: later steps reuse the same mental model for typing and validation.

Using **`signal`** for static text is optional; it previews **step 3+** where the value **changes**.

### TypeScript: `protected` and `readonly` (why here?)

You will see:

```typescript
export class App {
  protected readonly title = signal('Hello from Angular');
}
```

- **`readonly`**: you cannot later do `this.title = somethingElse` — the **binding** to that signal is fixed. You still update **value** with **`title.set('…')`**.
- **`protected`**: the **template** may read `title()` under strict template checking; **`private`** fields generally **cannot** be used from the template. See the full explanation in **[deeper-angular-and-typescript.md](./deeper-angular-and-typescript.md)**.

### Where the template lives

- **`template: \`…\``** — inline string (good for tiny demos).
- **`templateUrl: './app.html'`** — external file (used in the full root app and step 7).

Both compile the same way.

### Example (signal + interpolation)

**`app.ts`**

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  template: `<h1>{{ title() }}</h1>`,
})
export class App {
  protected readonly title = signal('Hello from Angular');
}
```

## React reference

| Angular | React |
|--------|--------|
| `{{ title() }}` | `{title}` (if `title` is state) |
| `signal` + `title()` | `useState` value |
| Class field | `const` / state inside a function component |

**Takeaway:** interpolation is **“evaluate and stringify in the view”** — same role as **`{…}`** in React.

---

**Dig deeper:** [private / protected / readonly + templates](./deeper-angular-and-typescript.md)

← [Overview](./README.md) · [Step 3 — Two-way binding](./step-03-ng-model.md) →
