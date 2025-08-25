# JWT Utilities

A comprehensive, type-safe JWT utility module for JavaScript/TypeScript applications.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions and generic support
- ✅ **Comprehensive JSDoc** - Detailed documentation for all functions
- ✅ **Error Handling** - Custom error types and configurable error behavior
- ✅ **Multiple Functions** - Sign, verify, decode, and utility functions
- ✅ **Generic Payloads** - Type-safe payload handling with generics
- ✅ **Flexible Options** - Extensive configuration options
- ✅ **Modern Promise API** - Async/await support throughout

## Installation

```bash
npm install advanced-js-kit
```

## Usage

### Two Usage Patterns

You can use the JWT utilities in two ways:

#### 1. Individual Function Imports (Recommended)

```typescript
import { jwtSign, jwtVerify, jwtDecode } from 'advanced-js-kit/jwt/jwt';

const token = await jwtSign({ userId: '123' }, 'secret');
const payload = await jwtVerify(token, 'secret');
```

#### 2. Namespace Object

```typescript
import { jwt } from 'advanced-js-kit/jwt/jwt';

const token = await jwt.sign({ userId: '123' }, 'secret');
const payload = await jwt.verify(token, 'secret');
```

### Basic Token Operations

```typescript
import { jwtSign, jwtVerify, jwtDecode } from 'advanced-js-kit/jwt/jwt';

// Sign a token
const token = await jwtSign(
  { userId: '123', role: 'admin' },
  'your-secret-key',
  { expiresIn: '1h' }
);

// Verify a token
const payload = await jwtVerify<{ userId: string; role: string }>(
  token,
  'your-secret-key'
);

// Decode without verification
const decoded = jwtDecode(token);
```

### Advanced Usage

```typescript
import { jwtVerify, jwtIsExpired, jwtTimeUntilExpiry, JwtError, jwt } from 'advanced-js-kit/jwt/jwt';

// Individual functions
const payload = await jwtVerify(token, secret, {
  audience: 'my-app',
  issuer: 'my-service',
  throwOnError: false
});

// Or using namespace
const payload2 = await jwt.verify(token, secret, {
  audience: 'my-app',
  issuer: 'my-service',
  throwOnError: false
});

// Check expiration status
if (jwt.isExpired(token)) {
  console.log('Token is expired');
}

// Get remaining time
const timeLeft = jwt.timeUntilExpiry(token);
console.log(`Token expires in ${timeLeft} seconds`);

// Error handling
try {
  await jwtVerify('invalid-token', secret);
} catch (error) {
  if (error instanceof JwtError) {
    console.log('JWT Error:', error.message);
    console.log('Original error:', error.originalError?.message);
  }
}
```

## API Reference

### `jwtSign<T>(payload, secret, options?)`

Signs a payload and creates a JWT token.

**Parameters:**
- `payload` - The payload to sign (object)
- `secret` - Secret key for signing
- `options` - Signing options (optional)

**Returns:** `Promise<string>` - The signed JWT token

### `jwtVerify<T>(token, secret, options?)`

Verifies a JWT token and returns the decoded payload.

**Parameters:**
- `token` - JWT token to verify
- `secret` - Secret key for verification  
- `options` - Verification options (optional)

**Returns:** `Promise<T | null>` - Decoded payload or null

### `jwtDecode<T>(token, options?)`

Decodes a JWT token without verification.

**Parameters:**
- `token` - JWT token to decode
- `options` - Decode options (optional)

**Returns:** `T | null` - Decoded payload or null

### `jwtIsExpired(token)`

Checks if a JWT token is expired.

**Parameters:**
- `token` - JWT token to check

**Returns:** `boolean | null` - Expiration status or null if invalid

### `jwtTimeUntilExpiry(token)`

Gets remaining time until token expiration.

**Parameters:**
- `token` - JWT token to check

**Returns:** `number | null` - Remaining seconds or null if invalid

## Types

### `JwtTokenPayload`
Base interface for JWT payloads extending the standard `JwtPayload`.

### `JwtSignOptions`  
Options for JWT signing operations.

### `JwtVerifyOptions`
Options for JWT verification operations.

### `JwtError`
Custom error class for JWT operations.

## Error Handling

The module provides comprehensive error handling:

- **JwtError**: Custom error class with original error context
- **Non-throwing mode**: Set `throwOnError: false` for null returns instead of exceptions
- **Detailed messages**: Clear error descriptions for debugging

## Security Best Practices

1. **Use strong secrets**: Use cryptographically secure random strings
2. **Set expiration**: Always include expiration times for tokens
3. **Validate thoroughly**: Use verification options like audience and issuer
4. **Handle errors properly**: Don't expose sensitive error details to clients
5. **Regular rotation**: Rotate secrets regularly in production

## License

This module is part of the advanced-js-kit package.
