# Step 4 — Move ACN helpers into an injectable service

**AngularJS equivalent:** `.factory('acnValidator', …)` and inject it into a controller.

**Runnable app:** `learn/04-service` → `npx ng serve learn-04-service`.

In this repo, **pure functions** also live in **`learn/shared/acn.ts`**; the **service** wraps them so you can practice **Angular dependency injection (DI)**.

## Goal

Keep **ACN-related behavior** behind a small **API class** (`AcnService`) and **inject** it into the component — same *separation* as importing from `utils/acn.ts`, but using Angular’s **injector** so tests and larger apps can **swap** or **scope** implementations.

## Angular concepts

### `@Injectable({ providedIn: 'root' })`

- Registers the class with Angular’s DI system as a **singleton for the whole app** (for this workspace, “app” = this mini `bootstrapApplication` tree).
- You do **not** need to add the service to an `NgModule`’s `providers` when using `providedIn: 'root'`.

### `inject(AcnService)` vs constructor injection

Two equivalent styles:

```typescript
private readonly acn = inject(AcnService);
```

```typescript
constructor(private readonly acn: AcnService) {}
```

The **`inject()`** style works in **field initializers** and fits **standalone** components without boilerplate. Both resolve **`AcnService`** from the same **injector**.

### Why `private` for the service but `protected` for signals?

In the runnable **`learn/04-service`** component:

```typescript
export class App {
  private readonly acn = inject(AcnService);
  protected readonly raw = signal('');
  protected readonly normalized = computed(() => this.acn.normalize(this.raw()));
  protected readonly digits = computed(() => this.acn.parseModelDigits(this.raw()));
}
```

- **`acn`** (the service) is **`private`**: the **template never references** `acn` by name — it only uses **`normalized()`**, **`digits()`**, **`raw()`**. TypeScript’s template checker requires that: **`private` is not visible in the template.**
- **`raw`**, **`normalized`**, **`digits`** are **`protected`**: the **template** binds to **`raw()`**, **`{{ normalized() }}`**, etc.

So: **template-facing state → `protected` (or `public`)**; **inject-only helpers → `private`**.

Full explanation: **[deeper-angular-and-typescript.md](./deeper-angular-and-typescript.md)**.

### `computed(...)` instead of methods

You can write **`normalized()`** as a **method** that returns `this.acn.normalize(this.raw())`. Using **`computed`**:

- Makes **dependencies explicit** (Angular tracks **`raw`** reads inside the function).
- Aligns with **signal-based change detection** and matches **step 7**’s style.

### Example service (this repo’s shape)

**`acn.service.ts`** (imports shared pure functions)

```typescript
import { Injectable } from '@angular/core';
import { normalizeAcnInput, parseAcnModelValue } from '../../../shared/acn';

@Injectable({ providedIn: 'root' })
export class AcnService {
  normalize(input: string): string {
    return normalizeAcnInput(input);
  }

  parseModelDigits(raw: string): string {
    return parseAcnModelValue(raw);
  }
}
```

**`app.ts`** (snippet — matches runnable step)

```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AcnService } from './acn.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  template: `
    <input [ngModel]="raw()" (ngModelChange)="raw.set($event)" />
    <p>{{ normalized() }}</p>
    <p>{{ digits() }}</p>
  `,
})
export class App {
  private readonly acn = inject(AcnService);
  protected readonly raw = signal('');
  protected readonly normalized = computed(() => this.acn.normalize(this.raw()));
  protected readonly digits = computed(() => this.acn.parseModelDigits(this.raw()));
}
```

## React reference

| Angular | React |
|--------|--------|
| `@Injectable` + `inject()` | `import { normalize } from './acn'` or React Context |
| Singleton `providedIn: 'root'` | module scope / one module instance |
| `computed(() => …)` | `useMemo` depending on state |

**Takeaway:** **Service ≈ injectable module**; use it when **many** components or tests share the same **constructed** API. Pure **`acn.ts`** functions are still fine without a service — this step teaches **DI**.

---

**Dig deeper:** [Dependency injection + visibility](./deeper-angular-and-typescript.md)

← [Step 3](./step-03-ng-model.md) · [Overview](./README.md) · [Step 5 — Button validate](./step-05-button-validate.md) →
