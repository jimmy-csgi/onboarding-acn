# Deeper dive — Angular + TypeScript (for newcomers)

Read this once, then use the **step** docs for the ACN-specific story. This page explains **patterns you will see in every step’s `app.ts`**: `private` / `protected` / `readonly`, **templates vs class**, **signals**, **dependency injection**, and **standalone** apps.

---

## 1. Your component is a **class** + a **template**

Angular merges two artifacts:

| Piece | What it is |
|--------|------------|
| **Class** (`export class App { … }`) | TypeScript: state, methods, `inject()`, lifecycle hooks. |
| **Template** (inline `template: \`…\`` or `templateUrl`) | HTML + Angular syntax: `{{ }}`, `[property]`, `(event)`, `@if`. |

At **build** time, Angular compiles the template into code that calls **your class**. The **browser** never sees your TypeScript class as raw text; it runs the compiled bundle.

**TypeScript still type-checks the template** (when `strictTemplates` is on, which this repo uses). That matters for **`private`** vs **`protected`** (below).

---

## 2. Why `private`, `protected`, and `readonly`?

These are **TypeScript** keywords. They do not change how Angular runs in the browser; they **document intent** and **catch mistakes at compile time**.

### `readonly`

```typescript
protected readonly raw = signal('');
```

- **`readonly`** means: you may not **reassign** the field later (`this.raw = signal('x')` is a **compile error**).
- A **`Signal`** is still **updated** with **`raw.set('x')`** or **`raw.update(...)`**. You are not replacing the signal object; you change its **current value**. So `readonly` here means: “this component always uses **this one** signal instance.”

Use `readonly` for **`inject(...)`** results and **`signal` / `computed`** fields so you do not accidentally overwrite them.

### `private`

```typescript
private readonly acn = inject(AcnService);
```

- **`private`** means: only **methods and other fields inside this class** can reference `acn`.
- Angular’s template type-checker follows TypeScript rules: the template is **not** allowed to use **`private`** members (e.g. you cannot write `{{ acn }}` if `acn` is private — you would get a type error).
- So we keep **`inject(AcnService)`** (or any helper only used **inside** `computed()` / methods) **`private`** when the template never needs to name it. The template still **benefits** from the service indirectly (e.g. via `normalized()` that calls `this.acn.normalize(...)` **inside** the class).

### `protected`

```typescript
protected readonly raw = signal('');
protected readonly normalized = computed(() => this.acn.normalize(this.raw()));
```

- **`protected`** means: this class **and subclasses** can access the member.
- For Angular, **`public` and `protected` members are visible to the template** under strict checking. **`private` is not.**
- Many Angular style examples use **`protected`** for fields the **template** reads (`{{ raw() }}`, `[ngModel]="raw()"`) so that:
  - **External TypeScript** code does not treat those fields as a stable public API of the class (subclasses/templates are the intended consumers), and
  - The template can still **see** them.

Some teams use **`public`** for everything used in the template; that is fine. **`protected`** is a common **convention** in generated / tutorial code, not a framework requirement.

### Quick rule of thumb

| Keyword | Typical use in a component |
|--------|-----------------------------|
| `private readonly x = inject(…)` | Service only used **inside** the class body, **not** in the template. |
| `protected readonly count = signal(0)` | State the **template** binds to (`{{ count() }}`). |
| `readonly` on any of the above | “Never replace this field after construction.” |

---

## 3. Signals: `signal`, `computed`, and `()`

- **`signal(initial)`** holds a value. Read it with **`name()`**, write with **`name.set(value)`** or **`name.update(fn)`**.
- **`computed(() => …)`** creates a **derived** value. It **re-runs** when any **signal read inside** the function changes. Use it like React’s **`useMemo`**, but declarative and integrated with Angular change detection.

Templates call signal/computed reads as functions: **`{{ normalized() }}`**.

---

## 4. Dependency injection (`inject`, `@Injectable`)

Angular has a built-in **injector**: a registry of **how to construct** services and **one instance per scope** (for `providedIn: 'root'`, one app-wide singleton).

- **`@Injectable({ providedIn: 'root' })`** on a class registers it so any injector in the app can create/share it.
- **`inject(AcnService)`** in a field initializer asks the **current** injector for that service (similar to constructor injection, but works in field initializers and in `inject()`-allowed contexts).

**Why not just `import` a plain object?** You can — and small apps often do. DI shines when you **swap implementations** in tests, **scope** services to a route, or share **stateful** services across many components without manual wiring.

---

## 5. Standalone components and `bootstrapApplication`

Modern Angular apps in this repo use **standalone** components: the **`imports: [FormsModule, …]`** array on `@Component` lists **direct** dependencies (modules, directives, pipes, other components).

**`main.ts`** calls **`bootstrapApplication(App, appConfig)`**, which:

1. Creates an Angular **platform** in the browser.
2. Creates a root **injector** (from `appConfig.providers`).
3. Instantiates **`App`** and renders it inside **`<app-root>`** in `index.html`.

That is the same *role* as **`createRoot(...).render(<App />)`** in React, but Angular uses **real custom elements** (`<app-root>`) and a **compiled** template.

---

## 6. Where to go next

Work through **[README.md](./README.md)** steps 1→7. When a line of `app.ts` confuses you, come back here for **visibility**, **signals**, and **DI**.

Official docs: [Angular essentials](https://angular.dev/overview) and [Signals](https://angular.dev/guide/signals).
