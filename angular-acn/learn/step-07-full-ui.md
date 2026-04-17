# Step 7 — Full live UI (**reactive form** + live validator + `@if`)

**AngularJS equivalent:** `$parsers` + `$formatters` + `$setValidity` + `ng-if` messages.

**Runnable app:** `learn/07-full` → `npx ng serve learn-07-full`.

The **root app** in this repo (**`angular-acn/src/app/`**) still uses **signals + `ngModel`** for teaching variety; **`learn/07-full`** uses **`FormGroup`** so you see **live** validity from **`form.controls.acn.errors`** (closer to RHF’s always-on field state).

## Goal

- One **`FormControl`** (`acn`) holds what the user types.
- A **live `ValidatorFn`** (`acn-live.validator.ts`) sets **`incomplete`** / **`checksum`** errors or **`null`** (valid) on **each change** — like deriving **`errors`** from value on every keystroke.
- **`toSignal(valueChanges)`** + **`computed`** still drive **`normalized`** / **`formatted`** for display.
- Template uses **`@if`** + **`form.controls.acn.hasError('…')`** for messages.

## Angular concepts

### Live validator vs submit-time (step 5)

- **Step 5 / 6:** **`updateOn: 'submit'`** — validators run when the form is submitted.
- **Step 7:** default **`updateOn: 'change'`** on the control — validators run whenever the value changes, so **`form.controls.acn.valid`** and **`errors`** stay in sync for inline messages.

### `toSignal` + `computed`

**`toSignal(this.form.controls.acn.valueChanges.pipe(startWith(...)))`** bridges the **RxJS** world (`valueChanges`) into a **signal** so **`computed`** can derive **`normalized`** / **`formatted`** the same way as before.

### `normalizeAcnInput` vs `parseAcnModelValue`

The **live validator** in **`acn-live.validator.ts`** uses **`normalizeAcnInput`** + **`isNineDigitAcn`** + **`validateAcn`** to mirror the old **`status`** logic. **`parseAcnModelValue`** is not required here because the UI allows spaces and strips them for validation via **`normalizeAcnInput`**.

### External template + styles

**`learn/07-full`** uses **`templateUrl`** + **`styleUrl`** for readability.

### Reference implementation (main app + tests)

- `src/app/app.ts` — signals + `computed` + **`ngModel`**
- `src/app/app.html` — template bindings + `@if`
- `src/app/acn.ts` — pure functions (**same rules** as `learn/shared/acn.ts`)
- `src/app/acn.spec.ts` — unit tests

## React reference

| Angular | React |
|--------|--------|
| `FormControl` + `ValidatorFn` | RHF **`register`** + **`rules`** / Zod field |
| `form.controls.acn.errors` | `formState.errors.acn` |
| `toSignal` + `computed` | `watch` / derived state from field value |
| `@if (form.controls.acn.hasError('checksum'))` | conditional error UI |

**Takeaway:** the **learn** full step shows **reactive forms** for **field-level errors + validity**; the **root** app shows the same **business rules** with **signals + `ngModel`**. Same ACN logic, two Angular patterns.

## Done

Compare with **`angularjs-acn/learn/07-directive-full/`** and **`angularjs-acn/src/`** for the same product rules, different framework machinery.

---

**Dig deeper:** [Signals vs forms](./deeper-angular-and-typescript.md)

← [Step 6](./step-06-directive.md) · [Overview](./README.md)
