# DXKit React JS Kit

> **Modern TypeScript React utility library with tree-shaking support** - Collection of React-specific utilities and Zustand helpers for TypeScript projects.

[![npm version](https://badge.fury.io/js/@dxkit-org/react-js-kit.svg)](https://www.npmjs.com/package/@dxkit-org/react-js-kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Tree Shakable](https://img.shields.io/badge/Tree--Shakable-✓-brightgreen.svg)](https://webpack.js.org/guides/tree-shaking/)

A collection of React-specific TypeScript utility functions for modern React development.

## Features

- 🚀 **TypeScript Support** - Full TypeScript support with type definitions
- ⚛️ **React Focused** - Designed specifically for React applications
- 📦 **Tree Shakable** - Import only what you need
- �️ **Zustand Utilities** - Enhanced Zustand store helpers
- 🧪 **Well Tested** - Comprehensive test coverage
- 📖 **Well Documented** - JSDoc comments for all functions
- 🔧 **Modern Build** - Built with tsup for optimal bundling
- 💡 **Excellent IDE Support** - Full auto-completion and IntelliSense support

## Installation

```bash
npm install @dxkit-org/react-js-kit zustand
```

**Alternative package managers:**

```bash
# Yarn
yarn add @dxkit-org/react-js-kit zustand

# pnpm
pnpm add @dxkit-org/react-js-kit zustand

# Bun
bun add @dxkit-org/react-js-kit zustand
```

> **Note**: This package requires `zustand` as a peer dependency.

## Usage

### Zustand Utilities

#### createZustandSelectors

The `createZustandSelectors` function enhances your Zustand store with auto-generated selector hooks, providing a more convenient way to access individual state properties.

```typescript
import { create } from "zustand"
import { createZustandSelectors } from "@dxkit-org/react-js-kit/zustand"

// Define your store
interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

const useCounterStoreBase = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

// Enhance with selectors
export const useCounterStore = createZustandSelectors(useCounterStoreBase)

// Usage in components
function Counter() {
  // Use individual selectors - only re-renders when count changes
  const count = useCounterStore.use.count()
  const increment = useCounterStore.use.increment()
  const decrement = useCounterStore.use.decrement()
  const reset = useCounterStore.use.reset()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

// You can still use the original store methods
function AnotherComponent() {
  // This will re-render on any state change
  const { count, increment } = useCounterStore()

  // Or use selective subscription
  const count = useCounterStore((state) => state.count)

  return <div>Count: {count}</div>
}
```

#### Benefits of createZustandSelectors

1. **Performance**: Each selector only subscribes to its specific property, reducing unnecessary re-renders
2. **DX**: Clean, intuitive API with excellent TypeScript support
3. **Flexibility**: Can still use original store methods when needed
4. **Type Safety**: Full TypeScript inference for all selectors

### Tree-shaking Support

You can import individual utilities for optimal tree-shaking:

```typescript
// Import specific utilities
import { createZustandSelectors } from "@dxkit-org/react-js-kit/zustand"

// Or import from the main entry point
import { createZustandSelectors } from "@dxkit-org/react-js-kit"
```

## 📋 Available Modules

### ⚛️ React Utilities

| Module    | Functions                | Description                           |
| --------- | ------------------------ | ------------------------------------- |
| `zustand` | `createZustandSelectors` | Enhanced Zustand store selector hooks |

## TypeScript Configuration

For optimal compatibility with this package, ensure your `tsconfig.json` uses modern module resolution:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // or "node16"/"nodenext"
    "module": "ESNext", // or "Node16"
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "jsx": "react-jsx" // for React projects
  }
}
```

## API Reference

### createZustandSelectors

```typescript
function createZustandSelectors<S extends UseBoundStore<StoreApi<object>>>(
  store: S
): S & { use: { [K in keyof T]: () => T[K] } }
```

**Parameters:**

- `store` - A Zustand store created with the `create` function

**Returns:**

- Enhanced store with `.use` property containing individual selector hooks

**Example:**

```typescript
interface UserState {
  user: { name: string; email: string } | null
  isLoading: boolean
  login: (user: { name: string; email: string }) => void
  logout: () => void
}

const useUserStoreBase = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  login: (user) => set({ user, isLoading: false }),
  logout: () => set({ user: null, isLoading: false }),
}))

export const useUserStore = createZustandSelectors(useUserStoreBase)

// In components
function UserProfile() {
  const user = useUserStore.use.user() // Only re-renders when user changes
  const logout = useUserStore.use.logout()

  if (!user) return <div>Not logged in</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev

# Type checking
npm run type-check
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT
