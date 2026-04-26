# Phase 14: Fix TypeScript Runtime Issues

**Date:** April 26, 2026  
**Status:** ✅ COMPLETED

## Objective

Fix critical issues preventing `npm run dev:swc` from working and `/docs` from being accessible. The codebase was rotely migrated from JavaScript to TypeScript without properly fixing the module system conflicts.

## Root Cause

Files use both `require()` (CommonJS) and `import` (ES6) in the same scope, causing TypeScript redeclaration errors. Additionally, `module.exports` is mixed with ES6 `export` in the same files.

---

## Commit 1: `phase1-fix-module-exports`

### Problem

Files mixing `require()` with `import` statements in the same scope cause TS2451 "Cannot redeclare block-scoped variable" errors.

### Files to Convert (require + module.exports → pure ES6 import/export)

| File                                   | Issue                                             |
| -------------------------------------- | ------------------------------------------------- |
| `src/config/logger.ts`                 | `import winston` + `module.exports = logger`      |
| `src/config/config.ts`                 | `export type` + `module.exports = config`         |
| `src/app.ts`                           | `require()` for all deps + `module.exports = app` |
| `src/index.ts`                         | `require()` for all deps                          |
| `src/docs/swaggerDef.ts`               | `require('path')` + `module.exports`              |
| `src/routes/v1/index.ts`               | All `require()` + `module.exports = router`       |
| `src/routes/v1/auth.route.ts`          | All `require()` + `module.exports = router`       |
| `src/routes/v1/docs.route.ts`          | All `require()` + `module.exports = router`       |
| `src/routes/v1/user.route.ts`          | All `require()` + `module.exports = router`       |
| `src/middlewares/auth.ts`              | All `require()` + `module.exports = auth`         |
| `src/middlewares/error.ts`             | All `require()` + `module.exports`                |
| `src/middlewares/rateLimiter.ts`       | `require()` + `module.exports`                    |
| `src/middlewares/validate.ts`          | `require()` + `module.exports`                    |
| `src/controllers/auth.controller.ts`   | `import` + `module.exports = authController`      |
| `src/controllers/user.controller.ts`   | `import` + `module.exports = userController`      |
| `src/controllers/index.ts`             | Uses `module.exports` style                       |
| `src/validations/index.ts`             | `module.exports.authValidation`                   |
| `src/validations/auth.validation.ts`   | `require()` + `module.exports`                    |
| `src/validations/user.validation.ts`   | `require()` + `module.exports`                    |
| `src/validations/custom.validation.ts` | `require()` + `module.exports`                    |
| `src/services/email.service.ts`        | `import` + `module.exports` + formatting          |

### Conversion Pattern

**Before (mixed CommonJS + ES6):**

```typescript
const express = require("express");
const helmet = require("helmet");
import config from "./config";

module.exports = app;
```

**After (pure ES6):**

```typescript
import express from "express";
import helmet from "helmet";
import config from "./config";

export default app;
```

---

## Commit 2: `phase1-fix-docs-route`

### Problem

`src/routes/v1/index.ts` only mounts `/docs` route when `config.env === 'development'`, but `dev:swc` may not set NODE_ENV=development.

### Fix

Change conditional to mount docs in all non-production environments:

**Before:**

```typescript
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}
```

**After:**

```typescript
if (config.env !== "production") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}
```

---

## Commit 3: `phase1-remove-deprecated-mongoose-options`

### Problem

`src/config/config.ts` specifies deprecated Mongoose 5 options (`useCreateIndex`, `useNewUrlParser`, `useUnifiedTopology`) which cause TypeScript errors in Mongoose 8+.

### Fix

Remove deprecated options from `IMongoose` interface and mongoose connection config:

**Before:**

```typescript
interface IMongoose {
  url: string;
  options: {
    useCreateIndex: boolean;
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };
}

mongoose: {
  url: ...,
  options: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
}
```

**After:**

```typescript
interface IMongoose {
  url: string;
  options: Record<string, never>;
}

mongoose: {
  url: ...,
  options: {},
}
```

---

## Verification

After all three commits:

```bash
npm run dev:swc
# Server should start on port 3000

# In browser or curl:
curl http://localhost:3000/v1/docs
# Swagger UI should be accessible
```

---

## Notes

- Build passes with `npm run build` after each commit
- `npm run dev:swc` uses SWC's `node -r @swc/register` which transpiles on-the-fly
- No `tsc --noEmit` errors should remain after Phase 14
