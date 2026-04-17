# Step 5 — Validate on a button (`Check`) with **reactive forms**

**AngularJS equivalent:** `ng-click="vm.check()"` + `vm.result`.

**Runnable app:** `learn/05-validate` → `npx ng serve learn-05-validate`.

## Goal

**Do not** run the heavy ACN validator on every keystroke. Use a **`FormGroup`** with **`updateOn: 'submit'`** so validators run when the user submits the form (clicks **Check**), similar to React Hook Form’s **`mode: 'onSubmit'`**. Read **`form.valid`**, **`form.invalid`**, and **`form.controls.acn.errors`** instead of maintaining a separate **`result()`** signal.

## Angular concepts

### `ReactiveFormsModule`, `FormGroup`, `FormControl`

- **`NonNullableFormBuilder`** (`inject(NonNullableFormBuilder)`) builds typed **`FormGroup` / `FormControl`** instances.
- **`formControlName="acn"`** links an `<input>` to **`form.controls.acn`**.
- **`[formGroup]="form"`** on **`<form>`** wires the group; **`(ngSubmit)="onSubmit()"`** runs when the user hits a **`type="submit"`** button inside that form.

### `updateOn: 'submit'`

Pass **`{ updateOn: 'submit' }`** as the **second** argument to **`fb.group({ … }, { updateOn: 'submit' })`**. Angular then syncs the control value from the DOM and runs **synchronous validators** on **submit** — not on every keypress.

### Custom `ValidatorFn`

A validator is a function **`(control: AbstractControl) => ValidationErrors | null`**. Return **`null`** when valid, or an object like **`{ acnChecksum: true }`** when invalid. The runnable app uses **`acn-check.validator.ts`** with **`acnSubmitValidator(acnService)`** so parsing + checksum stay testable and reuse **`AcnService`**.

### Showing messages after Check

Use a small **`submitted` signal** (or `submitted` flag) set to **`true`** in **`onSubmit()`** so you only show “Valid / Invalid” **after** the first submit, while still using **`form.valid`** for the outcome:

- **`submitted() && form.valid`** → valid ACN.
- **`submitted() && form.invalid`** → show generic error (optional: branch on **`form.controls.acn.hasError('acnIncomplete')`** vs **`'acnChecksum'`**).

### Example (aligned with runnable `learn/05-validate`)

**`acn-check.validator.ts`**

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AcnService } from './acn.service';

export function acnSubmitValidator(acnService: AcnService): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const digits = acnService.parseModelDigits(control.value ?? '');
    if (digits.length !== 9) return { acnIncomplete: true };
    return acnService.isValidAcn(digits) ? null : { acnChecksum: true };
  };
}
```

**`app.ts`** (snippet)

```typescript
import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AcnService } from './acn.service';
import { acnSubmitValidator } from './acn-check.validator';

@Component({
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="acn" />
      <button type="submit">Check</button>
    </form>
    @if (submitted() && form.valid) { … }
    @if (submitted() && form.invalid) { … }
  `,
})
export class App {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly acnService = inject(AcnService);

  protected readonly form = this.fb.group(
    { acn: this.fb.control('', { validators: [acnSubmitValidator(this.acnService)] }) },
    { updateOn: 'submit' },
  );

  protected readonly submitted = signal(false);

  onSubmit(): void {
    this.submitted.set(true);
  }
}
```

**`acn.service.ts`** still wraps **`learn/shared/acn.ts`** so the component does not import raw helpers.

### Visibility recap

| Member | Visibility | Why |
|--------|------------|-----|
| `fb`, `acnService` | `private` | Only used when building the form / validator — template never names them. |
| `form`, `submitted` | `protected` | Template uses **`form`**, **`form.valid`**, **`submitted()`**. |

## React reference

| Angular | React |
|--------|--------|
| `FormGroup` + validators | React Hook Form **`useForm`** + **`resolver`** / rules |
| `form.valid` | `formState.isValid` (with analogous submit mode) |
| `form.controls.acn.errors` | `formState.errors.acn` |
| `(ngSubmit)` | `handleSubmit(onValid)` |

**Takeaway:** reactive forms give you **framework-owned validity state** (`valid` / `errors`) instead of mirroring it in your own signal.

---

**Dig deeper:** [Templates + DI](./deeper-angular-and-typescript.md)

← [Step 4](./step-04-service.md) · [Overview](./README.md) · [Step 6 — Directive](./step-06-directive.md) →
