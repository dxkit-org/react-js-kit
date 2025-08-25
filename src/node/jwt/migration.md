# Migration Guide: From `jsonwebtoken` to `advanced-js-kit`

This guide helps you migrate from the popular `jsonwebtoken` library to the JWT utilities provided by `advanced-js-kit`.

## Why Migrate?

- **Better TypeScript Support**: Full type safety with generics for payload types
- **Promise-based API**: Modern async/await support instead of callbacks
- **Enhanced Error Handling**: Custom `JwtError` class with better error messages
- **Tree Shaking**: Import only the JWT functions you need
- **Additional Features**: Built-in validation and flexible error handling options

## Prerequisites

Before starting the migration:

1. **Turn off unused imports removal on save** if enabled in your IDE
2. Install `advanced-js-kit`: `npm install advanced-js-kit`
3. Keep `jsonwebtoken` installed during the migration process

## Step-by-Step Migration

### Step 1: Update Import Statements

**Before:**
```typescript
import jwt from "jsonwebtoken";
```

**After:**
```typescript
import { jwtSign, jwtVerify } from "advanced-js-kit";
```

### Step 2: Replace `jwt.sign()` with `jwtSign()`

**Before:**
```typescript
const token = jwt.sign({ userId: "123" }, "secret", { expiresIn: "1h" });
```

**After:**
```typescript
const token = await jwtSign({ userId: "123" }, "secret", { expiresIn: "1h" });
```

### Step 3: Replace `jwt.verify()` with `jwtVerify()`

**Before:**
```typescript
jwt.verify(token, "secret", (err, decoded) => {
  if (err) {
    console.error("Verification failed:", err);
    return;
  }
  console.log("Decoded payload:", decoded);
});
```

**After:**
```typescript
try {
  const payload = await jwtVerify<{ userId: string }>(token, "secret");
  console.log("Decoded payload:", payload);
} catch (error) {
  console.error("Verification failed:", error);
}
```

### Step 4: Handle Error Cases (Optional)

If you prefer not to throw errors on verification failure:

```typescript
const payload = await jwtVerify(token, "secret", { throwOnError: false });
if (payload === null) {
  console.log("Token verification failed");
} else {
  console.log("Decoded payload:", payload);
}
```

## Key Differences

| Feature | `jsonwebtoken` | `advanced-js-kit` |
|---------|----------------|-------------------|
| API Style | Callback-based | Promise-based |
| TypeScript | Basic types | Full generic support |
| Error Handling | Error callbacks | Exceptions + optional |
| Imports | Default import | Named imports |
| Bundle Size | Full library | Tree-shakable |

## Advanced Features

### Type-Safe Payloads

```typescript
interface UserPayload {
  userId: string;
  role: 'admin' | 'user';
  permissions: string[];
}

const token = await jwtSign<UserPayload>({
  userId: "123",
  role: "admin",
  permissions: ["read", "write"]
}, "secret");

const payload = await jwtVerify<UserPayload>(token, "secret");
// payload is now fully typed!
```

### Default Expiration

```typescript
const token = await jwtSign(
  { userId: "123" }, 
  "secret", 
  { defaultExpiresIn: "24h" }
);
```

## Final Steps

1. Test your migrated code thoroughly
2. Remove the `jsonwebtoken` dependency: `npm uninstall jsonwebtoken`
3. Update your `@types/jsonwebtoken` if installed: `npm uninstall @types/jsonwebtoken`

## Need Help?

If you encounter issues during migration, check the [JWT documentation](./jwt.md) for more examples and API details.