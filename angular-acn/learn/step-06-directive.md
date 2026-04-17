# Step 6 — Attribute directive (keyboard guard)

**AngularJS equivalent:** `acn-input` directive with `$parsers` + `keydown` / `paste`.

**Runnable app:** `learn/06-directive` → `npx ng serve learn-06-directive`.

The runnable code uses selector **`appAcnDigitsOnly`** (camelCase attribute **`appAcnDigitsOnly`** on the host).

## Goal

Encapsulate **DOM behavior** on an `<input>`: block non-digit **keys** for typing — **without** stuffing all `keydown` logic into the root component. Combine with a **`FormControl`** + **`valueChanges`** so the **model** stays **digits-only** (`parseAcnModelValue` via **`AcnService`**). The directive only handles **keys**; paste is still normalized by that subscription (same spirit as AngularJS **`$parsers`**). **Check** uses the same **`FormGroup` + `updateOn: 'submit'`** pattern as step 5.

## Angular concepts

### Directive vs component

| | **Component** | **Directive** |
|---|----------------|---------------|
| Template | Has its own HTML | **No** template — **decorates** a host element |
| Typical use | Screen / widget | Reusable **behavior** on an existing element |

### `selector: '[appAcnDigitsOnly]'`

- Square brackets mean: this directive matches an **attribute** on any element, e.g. **`<input appAcnDigitsOnly …>`**.
- Angular normalizes **`appAcnDigitsOnly`** in HTML (case-insensitive in the DOM).

### `standalone: true`

The directive is its own unit: import it next to **`ReactiveFormsModule`** in the root component:

```typescript
@Component({
  imports: [ReactiveFormsModule, AcnDigitsOnlyDirective],
  // ...
})
```

### `@HostListener('keydown', ['$event'])`

- **`HostListener`** registers a listener on the **host element** (the element that carries the directive).
- **`$event`** is the **`KeyboardEvent`**.

The handler **`preventDefault()`** on bad keys so they never enter the input. **Modifier + key** shortcuts (copy/paste, select all) usually **return early** so we do not block them.

### AngularJS `$parsers` vs this stack

AngularJS often combined **keydown** + **`$parsers`** in one directive. In Angular (v2+), people often:

- Use a **directive** for **keys**, and
- **`FormControl` + `valueChanges`** + **`setValue(..., { emitEvent: false })`** for **digits-only** model shape,

or a **`ControlValueAccessor`** for full **`ngModel`-style** integration. This step keeps the **learning surface small**: directive = **keys**; **`valueChanges`** = **sanitize**; **`FormGroup`** = **validate on submit**.

### What the `constructor()` + `valueChanges` block does (runnable `app.ts`)

The **`appAcnDigitsOnly`** directive stops many non-digit **keystrokes**, but **paste**, **autofill**, or **drag-drop** can still put letters into the `<input>`. The **`FormControl`** still mirrors that string, so we listen to **`valueChanges`**:

1. **`parseModelDigits(raw)`** — same as **`parseAcnModelValue`**: keep ASCII digits only, max 9 characters.
2. If **`digits === raw`**, do nothing (already clean).
3. If they differ, **`setValue(digits, { emitEvent: false })`** — write the cleaned string back without emitting another **`valueChanges`** (otherwise you risk a **subscribe → setValue → valueChanges → subscribe** loop).
4. **`updateValueAndValidity({ emitEvent: true })`** — validators should run on the **new** value (e.g. length/checksum after paste). **`emitEvent: true`** lets the rest of the form hear status updates if needed.
5. **`takeUntilDestroyed()`** — unsubscribes when the component is destroyed so this is not a memory leak (important if the component were ever recreated).

That block is the reactive-forms equivalent of **`(ngModelChange)="acn.set(parseDigits($event))"`** from the template-driven style.

### Example directive (runnable style)

```typescript
import { Directive, HostListener } from '@angular/core';

const NAV_KEYS = new Set(['Backspace', 'Delete', 'Tab', /* … */]);

@Directive({
  selector: '[appAcnDigitsOnly]',
  standalone: true,
})
export class AcnDigitsOnlyDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (NAV_KEYS.has(event.key)) return;
    if (event.key.length === 1 && !/\d/.test(event.key)) {
      event.preventDefault();
    }
  }
}
```

**Host usage (reactive form):**

```html
<input appAcnDigitsOnly formControlName="acn" />
```

Subscribe in **`constructor()`** to **`form.controls.acn.valueChanges`** and **`setValue`** parsed digits when the raw string differs (see runnable **`learn/06-directive/src/app/app.ts`**).

## React reference

| Angular | React |
|--------|--------|
| Attribute directive on `<input>` | Wrapper component or **`useEffect`** on a **ref** |
| `@HostListener` | `addEventListener` |
| `standalone: true` directive | small hook / component |

**Takeaway:** directive ≈ **reusable DOM behavior** — closest to a **custom hook + ref** in React.

---

**Dig deeper:** [Standalone + imports](./deeper-angular-and-typescript.md)

← [Step 5](./step-05-button-validate.md) · [Overview](./README.md) · [Step 7 — Full UI](./step-07-full-ui.md) →
