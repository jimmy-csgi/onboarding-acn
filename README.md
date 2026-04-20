# ACN validator — exercise

This repository contains two implementations of the same **Australian Company Number (ACN)** validator: checksum on nine digits, ASIC-style spacing (`XXX XXX XXX`) while typing, digits-only model, and validation messaging.

| Folder           | Stack            | Role |
|------------------|------------------|------|
| **`angular-acn/`**    | Angular 21 (TypeScript, Vitest) | Primary modern app; logic in `src/app/acn.ts` |
| **`angularjs-acn/`**  | AngularJS 1.8                   | Legacy-style comparison app; logic in `src/app.js` |

Shared teaching steps and smaller demos live under `angular-acn/learn/` and `angularjs-acn/learn/`.

## Prerequisites

- **Node.js** (LTS recommended) and **npm**

## Run the Angular app

```bash
cd angular-acn
npm install
npm start
```

Open **http://localhost:4200/** (or the URL shown in the terminal).

**Unit tests:** `npm test`

## Run the AngularJS app

There is no dev server script; use a static file server from the `angularjs-acn` directory so paths to `node_modules` resolve.

```bash
cd angularjs-acn
npm install
npx --yes http-server -p 8080 -c-1
```

Open **http://localhost:8080/src/**

**Unit tests:** `npm test` (Karma)

## Optional: Angular “learn” mini-apps

From **`angular-acn/`**, after `npm install`, you can serve individual tutorial projects, for example:

```bash
npx ng serve learn-07-full
```

See **`angular-acn/learn/README.md`** for the full list of project names.
