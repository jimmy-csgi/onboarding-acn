# Step 1 — Bootstrap & root component

**AngularJS equivalent:** `ng-app="acnApp"` + `angular.module('acnApp', [])` with no UI logic yet.

**Runnable app:** `learn/01-bootstrap` → `npx ng serve learn-01-bootstrap` (from `angular-acn/`).

## Goal

Prove the toolchain works: **Angular boots** and renders a **root component** (`<app-root>`).

## What actually runs (mental model)

1. The browser loads **`index.html`**, which contains **`<app-root></app-root>`** — an empty custom element placeholder.
2. **`main.ts`** runs. It imports **`bootstrapApplication`** from `@angular/platform-browser`.
3. **`bootstrapApplication(App, appConfig)`** tells Angular: “Create the app shell, create an **injector** from `appConfig`, instantiate **`App`**, and **render `App`’s template** inside `<app-root>`.”

So “bootstrap” means: **connect your root component’s view to a host node in the DOM**, and **start Angular’s runtime** (change detection, DI, etc.).

## Files in this step (typical layout)

| File | Role |
|------|------|
| `src/main.ts` | Entry point: `bootstrapApplication(App, appConfig)`. |
| `src/app/app.config.ts` | **`ApplicationConfig`**: root-level **`providers`** (e.g. error listeners). Grows later if you add HTTP, routing, etc. |
| `src/app/app.ts` | Root **`@Component`**: `selector: 'app-root'` matches the tag in `index.html`. |
| `src/index.html` | Static shell + `<app-root>`. |

You are **not** using signals, forms, or services yet — same spirit as AngularJS step 1: “no errors in the console.”

## Angular concepts

- **`@Component`** marks a class as a component; **`selector: 'app-root'`** is the **tag name** Angular will drive (must match `index.html`).
- **`standalone: true`** (on the component) means it **imports what it needs** in its own `imports: []` array — no separate `NgModule` for this tiny app.
- The second argument to **`bootstrapApplication`** is where **app-wide providers** live (`appConfig`).

## React reference

| Angular | React |
|--------|--------|
| `bootstrapApplication(App, …)` | `createRoot(document.getElementById('root')).render(<App />)` |
| `@Component({ selector: 'app-root' })` | Root component mounted into a DOM node |
| `index.html` contains `<app-root></app-root>` | `index.html` contains `<div id="root"></div>` (or similar) |

**Takeaway:** “Bootstrap” = **attach the root UI class to a host node in HTML** and **start the framework**.

---

**Dig deeper:** [TypeScript visibility, signals, DI](./deeper-angular-and-typescript.md)

← [Overview](./README.md) · [Step 2 — Interpolation](./step-02-interpolation.md) →
