# Learn Angular (ACN validator) — step-by-step

This folder mirrors the teaching path in **`angularjs-acn/learn/`**, but for **modern Angular** (standalone components, signals, dependency injection).

If you are **new to Angular or TypeScript visibility** (`private` / `protected` / `readonly` in components), read **[deeper-angular-and-typescript.md](./deeper-angular-and-typescript.md)** once, then follow the steps below.

## How to use these steps

1. You can read them in order **without** coding — each markdown file explains one idea.
2. Each step also has a **runnable mini-app** under `learn/0X-…/` (same idea as `angularjs-acn/learn/`). From the **`angular-acn/`** repo root, run **`ng serve <project>`** (see table below). Shared ACN helpers live in **`learn/shared/acn.ts`**.
3. The **main** demo app (with tests) still lives in **`../src/app/`** at the repo root.

### Run a step locally

From **`angular-acn/`** after `npm install`:

| Step | Folder | `ng serve` project name |
|------|--------|-------------------------|
| 1 | `learn/01-bootstrap` | `learn-01-bootstrap` |
| 2 | `learn/02-interpolation` | `learn-02-interpolation` |
| 3 | `learn/03-ng-model` | `learn-03-ng-model` |
| 4 | `learn/04-service` | `learn-04-service` |
| 5 | `learn/05-validate` | `learn-05-validate` |
| 6 | `learn/06-directive` | `learn-06-directive` |
| 7 | `learn/07-full` | `learn-07-full` |

Example:

```bash
cd angular-acn
npx ng serve learn-04-service
```

## Step index

| Step | File | Idea (AngularJS equivalent) |
|------|------|------------------------------|
| — | [deeper-angular-and-typescript.md](./deeper-angular-and-typescript.md) | **`private` / `protected` / `readonly`**, templates, signals, DI (read alongside steps) |
| 1 | [step-01-bootstrap.md](./step-01-bootstrap.md) | `ng-app` + empty module → bootstrap + root component |
| 2 | [step-02-interpolation.md](./step-02-interpolation.md) | Controller + `{{ }}` → component + template binding |
| 3 | [step-03-ng-model.md](./step-03-ng-model.md) | `ng-model` → `ngModel` + signal |
| 4 | [step-04-service.md](./step-04-service.md) | `factory` → `injectable` service |
| 5 | [step-05-button-validate.md](./step-05-button-validate.md) | Check button + `ng-click` → click + service |
| 6 | [step-06-directive.md](./step-06-directive.md) | `acn-input` directive → attribute directive |
| 7 | [step-07-full-ui.md](./step-07-full-ui.md) | Full form + live messages → signals + `@if` |

## Run the full app in this repo

```bash
cd angular-acn
npm install
npm start
```

## Run tests

```bash
npm test
```

(Uses the Angular CLI **Vitest** integration — see `angular.json` test target.)

## Official context

- Angular docs and local workflow: [Angular CLI / project setup](https://angular.dev) (see also `llms-full.txt` in Angular assets if you use AI context).
