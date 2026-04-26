# Node Express Boilerplate Modernization Plan

## Overview

Converting a 6-year-old JavaScript Express boilerplate to modern tooling:

- TypeScript instead of JavaScript
- SWC (Rust-based compiler) instead of Babel/ts-node
- Latest dependency versions
- Modern DevOps (Docker)

## Current State

- JavaScript (ES6/CommonJS)
- Node 12+
- Mongoose 5.x, Express 4.17, Jest 26
- Legacy tooling: nodemon, babel-style transpilation

## Target State

- TypeScript (strict mode)
- Node 20 LTS
- Mongoose 8.x, Express 4.21, Jest 29
- SWC for fast compilation
- Multi-stage Docker builds

---

## Phase 1: Foundation Setup ✅ COMPLETED

- [x] Add TypeScript + SWC tooling
- [x] Create .swcrc configuration
- [x] Create tsconfig.json (strict mode)
- [x] Create tsconfig.build.json
- [x] Create jest.config.ts
- [x] Update package.json (scripts, dependencies)
- [x] Update .gitignore
- [x] Install dependencies

**Phase 1 Summary:** See `summary.md`

---

## Phase 2: Config Files Conversion

Convert JavaScript config files to TypeScript using `git mv` to preserve history.

### Files to Convert

```
src/config/config.js → config.ts
src/config/roles.js → roles.ts
src/config/tokens.js → tokens.ts
src/config/logger.js → logger.ts
src/config/morgan.js → morgan.ts
src/config/passport.js → passport.ts
```

### Steps

1. `git mv src/config/config.js src/config/config.ts`
2. Add TypeScript types to env vars validation
3. Add interface types for config objects
4. Update imports in dependent files
5. Repeat for each config file

### TypeScript Changes

- Define `Config` interface with typed fields
- Define `IJwt`, `IEmail`, `IMongoose` interfaces
- Use `Joi.ValidationError` properly typed
- Export interfaces for use by other modules

### Update .env.example

Add `NODE_ENV` variable documentation:

```
# Node environment (development, production, test)
NODE_ENV=development
```

---

## Phase 3: Utility Conversion

Convert utility modules to TypeScript.

### Files to Convert

```
src/utils/ApiError.js → ApiError.ts
src/utils/catchAsync.js → catchAsync.ts
src/utils/pick.js → pick.ts
```

### TypeScript Changes

- `ApiError` class: Add typed constructor, extend Error properly
- `catchAsync`: Add proper Promise typing
- `pick`: Add generic type support

---

## Phase 4: Model Conversion

Convert Mongoose models to TypeScript with proper typing.

### Files to Convert

```
src/models/index.js → index.ts
src/models/user.model.js → user.model.ts
src/models/token.model.js → token.model.ts
src/models/plugins/index.js → plugins/index.ts
src/models/plugins/toJSON.plugin.js → toJSON.plugin.ts
src/models/plugins/paginate.plugin.js → paginate.plugin.ts
```

### TypeScript Changes

- Define Mongoose document interfaces (`IUser`, `IToken`)
- Define plugin function types
- Add method/staticmethod typing for schemas
- Update Joi validations with proper types

---

## Phase 5: Service/Controller Conversion

### Service Files

```
src/services/index.js → index.ts
src/services/user.service.js → user.service.ts
src/services/auth.service.js → auth.service.ts
src/services/token.service.js → token.service.ts
src/services/email.service.js → email.service.ts
```

### Controller Files

```
src/controllers/index.js → index.ts
src/controllers/auth.controller.js → auth.controller.ts
src/controllers/user.controller.js → user.controller.ts
```

### TypeScript Changes

- Add DTO interfaces for request/response bodies
- Add typed parameters (userId: Types.ObjectId)
- Return type annotations for all functions
- Update bcrypt → bcrypt API changes (promise-based)

---

## Phase 6: Middleware & Validation Conversion

### Middleware Files

```
src/middlewares/validate.js → validate.ts
src/middlewares/auth.js → auth.ts
src/middlewares/error.js → error.ts
src/middlewares/rateLimiter.js → rateLimiter.ts
```

### Validation Files

```
src/validations/index.js → index.ts
src/validations/custom.validation.js → custom.validation.ts
src/validations/user.validation.js → user.validation.ts
src/validations/auth.validation.js → auth.validation.ts
```

### TypeScript Changes

- Define `Request` extensions with typed body/params/query
- Add `NextFunction` typing
- Define Joi schema types properly

---

## Phase 7: Route Conversion

### Files

```
src/routes/v1/index.js → index.ts
src/routes/v1/auth.route.js → auth.route.ts
src/routes/v1/user.route.js → user.route.ts
src/routes/v1/docs.route.js → docs.route.ts
```

### TypeScript Changes

- Add typed route handlers
- Define router types properly

---

## Phase 8: App Entry Points

### Files

```
src/app.js → app.ts
src/index.js → index.ts
```

### TypeScript Changes

- Define Express app type
- Add proper server typing for graceful shutdown
- Connection handler typing

---

## Phase 9: Test Conversion

### Fixtures

```
tests/fixtures/user.fixture.js → user.fixture.ts
tests/fixtures/token.fixture.js → token.fixture.ts
```

### Unit Tests

```
tests/unit/models/user.model.test.js → user.model.test.ts
tests/unit/models/plugins/toJSON.plugin.test.js → toJSON.plugin.test.ts
tests/unit/models/plugins/paginate.plugin.test.js → paginate.plugin.test.ts
tests/unit/middlewares/error.test.js → error.test.ts
```

### Integration Tests

```
tests/integration/auth.test.js → auth.test.ts
tests/integration/user.test.js → user.test.ts
tests/integration/docs.test.js → docs.test.ts
```

### Setup

```
tests/utils/setupTestDB.js → setupTestDB.ts
```

---

## Phase 10: ESLint Flat Config Migration

### Actions

1. Create `.eslint.config.js` (ESLint 9 flat config)
2. Add `@typescript-eslint` rules
3. Remove `.eslintrc.json`
4. Update `.eslintignore` if needed

### ESLint Config Structure

```javascript
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

module.exports = [
  { files: ['**/*.ts'] },
  { languageOptions: { parser: tsparser } },
  { plugins: { '@typescript-eslint': tseslint } },
  // ... rules
];
```

---

## Phase 11: Docker Modernization

### Dockerfile Changes

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### docker-compose.yml Changes

- Update MongoDB: `mongo:4.2.1-bionic` → `mongo:7.0`
- Update compose version: `3` → `3.8`

---

## Phase 12: CLI Generator Update

### File

`bin/createNodejsApp.js` - Update to generate TypeScript project

### Changes

- Update template files to .ts extension
- Update dependency versions in templates
- Add TypeScript config file templates

---

## Phase 13: Final Verification

### Commands to Run

```bash
npm run lint        # ESLint with TypeScript
npm run test        # Jest with ts-jest
npm run build       # SWC compilation
npm run dev:swc     # Dev server with SWC
```

### Fix any TypeScript errors from strict mode

---

## Git History Preservation

Use `git mv` for every file rename to preserve:

- Blame history
- Git log
- File history in GitHub/GitLab UI

Example:

```bash
git mv src/utils/ApiError.js src/utils/ApiError.ts
git commit -m "refactor: convert ApiError to TypeScript"
```

---

## Risks & Mitigations

| Risk                                | Mitigation                                       |
| ----------------------------------- | ------------------------------------------------ |
| Mongoose 5→8 breaking changes       | Review migration guide; test connection handling |
| bcrypt API difference from bcryptjs | bcrypt uses promises; update code accordingly    |
| ESLint 7→9 flat config              | Use @typescript-eslint recommended rules         |
| Jest 26→29 config changes           | Update config format; ts-jest handles TypeScript |

---

## Dependencies Upgraded

| Package           | Old  | New  |
| ----------------- | ---- | ---- |
| Node              | 12+  | 20+  |
| express           | 4.17 | 4.21 |
| mongoose          | 5.7  | 8.5  |
| helmet            | 4.1  | 7.1  |
| bcryptjs → bcrypt | 2.4  | 5.1  |
| jest              | 26   | 29   |
| eslint            | 7    | 9    |
| prettier          | 2.0  | 3.3  |

---

## File Conversion Order

```
config → utils → models → services → controllers →
routes → middlewares → validations → app → index → tests
```

This order ensures dependencies are resolved correctly.
