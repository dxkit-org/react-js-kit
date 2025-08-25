# Network Utilities

Comprehensive network utilities for port management and connectivity testing in JavaScript/TypeScript applications.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions and interfaces
- ✅ **Comprehensive JSDoc** - Detailed documentation for all functions
- ✅ **Error Handling** - Custom error types and robust error handling
- ✅ **Async/Await Support** - Modern Promise-based API throughout
- ✅ **Port Management** - Check availability, find open ports, wait for services
- ✅ **Flexible Configuration** - Extensive options for timeouts, hosts, and ranges
- ✅ **Parallel Processing** - Check multiple ports simultaneously

## Installation

```bash
npm install advanced-js-kit
```

## Usage

### Two Usage Patterns

You can use the network utilities in two ways:

#### 1. Individual Function Imports (Recommended)

```typescript
import { isPortInUse, isPortAvailable, findAvailablePort } from 'advanced-js-kit/network/port';

const inUse = await isPortInUse(3000);
const available = await isPortAvailable(3001);
const openPort = await findAvailablePort({ startPort: 8000 });
```

#### 2. Package Import

```typescript
import { isPortInUse, isPortAvailable, findAvailablePort } from 'advanced-js-kit';

const inUse = await isPortInUse(3000);
```

### Basic Port Operations

```typescript
import { 
  isPortInUse, 
  isPortAvailable, 
  findAvailablePort 
} from 'advanced-js-kit/network/port';

// Check if a port is in use
const port3000InUse = await isPortInUse(3000);
console.log(`Port 3000 is ${port3000InUse ? 'in use' : 'available'}`);

// Check if a port is available
const port3001Available = await isPortAvailable(3001);
if (port3001Available) {
  console.log('Port 3001 is ready to use!');
}

// Find an available port
const availablePort = await findAvailablePort();
console.log(`Found available port: ${availablePort}`);

// Find a port in a specific range
const webPort = await findAvailablePort({ 
  startPort: 8000, 
  endPort: 8100 
});
console.log(`Available web port: ${webPort}`);
```

### Advanced Port Management

```typescript
import { 
  findAvailablePort,
  checkMultiplePorts,
  waitForPort,
  PortError
} from 'advanced-js-kit/network/port';

// Find port with custom configuration
const port = await findAvailablePort({
  startPort: 3000,
  endPort: 3010,
  host: 'localhost',
  timeout: 2000,
  maxTries: 5
});

// Check multiple ports at once
const portsToCheck = [3000, 3001, 3002, 8080, 8081];
const portStatus = await checkMultiplePorts(portsToCheck);

portStatus.forEach((available, port) => {
  console.log(`Port ${port}: ${available ? 'available' : 'in use'}`);
});

// Wait for a service to start
console.log('Waiting for service to start on port 3000...');
await waitForPort(3000, 'in-use', { 
  timeout: 5000,
  pollInterval: 500,
  overallTimeout: 30000 
});
console.log('Service is now running!');

// Wait for a port to be freed
await waitForPort(3000, 'available', { overallTimeout: 10000 });
console.log('Port 3000 is now available');
```

### Service Management Examples

```typescript
import { 
  findAvailablePort, 
  waitForPort, 
  isPortAvailable 
} from 'advanced-js-kit/network/port';
import { spawn } from 'child_process';

// Start a service on an available port
const startService = async () => {
  const port = await findAvailablePort({ startPort: 3000 });
  
  console.log(`Starting service on port ${port}`);
  const service = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: port.toString() }
  });
  
  // Wait for the service to be ready
  await waitForPort(port, 'in-use', { overallTimeout: 10000 });
  console.log(`Service is ready on port ${port}`);
  
  return { service, port };
};

// Health check for multiple services
const healthCheck = async (services: { name: string; port: number }[]) => {
  const ports = services.map(s => s.port);
  const status = await checkMultiplePorts(ports);
  
  const results = services.map(service => ({
    name: service.name,
    port: service.port,
    healthy: status.get(service.port) || false
  }));
  
  return results;
};

// Example usage
const services = [
  { name: 'API Server', port: 3000 },
  { name: 'Database', port: 5432 },
  { name: 'Redis', port: 6379 },
  { name: 'Frontend', port: 8080 }
];

const healthResults = await healthCheck(services);
healthResults.forEach(result => {
  console.log(`${result.name} (${result.port}): ${result.healthy ? '✅ Healthy' : '❌ Down'}`);
});
```

### Development Server Helper

```typescript
import { findAvailablePort, waitForPort } from 'advanced-js-kit/network/port';

class DevServer {
  private port?: number;
  private process?: any;

  async start(preferredPort: number = 3000) {
    // Try preferred port first, then find any available port
    this.port = await isPortAvailable(preferredPort) 
      ? preferredPort 
      : await findAvailablePort({ startPort: preferredPort });

    console.log(`Starting development server on port ${this.port}`);
    
    // Start your server process here
    this.process = spawn('npm', ['run', 'dev'], {
      env: { ...process.env, PORT: this.port.toString() }
    });

    // Wait for server to be ready
    await waitForPort(this.port, 'in-use', { 
      overallTimeout: 30000,
      pollInterval: 1000 
    });

    console.log(`🚀 Server ready at http://localhost:${this.port}`);
    return this.port;
  }

  async stop() {
    if (this.process && this.port) {
      this.process.kill();
      
      // Wait for port to be freed
      await waitForPort(this.port, 'available', { 
        overallTimeout: 10000 
      });
      
      console.log(`Server stopped and port ${this.port} is now available`);
    }
  }
}

// Usage
const server = new DevServer();
const port = await server.start(3000);
// ... do work ...
await server.stop();
```

### Error Handling

```typescript
import { isPortInUse, findAvailablePort, PortError } from 'advanced-js-kit/network/port';

try {
  // Invalid port number
  await isPortInUse(70000); // Port out of range
} catch (error) {
  if (error instanceof PortError) {
    console.error('Port Error:', error.message);
    console.log('Port:', error.port);
    console.log('Host:', error.host);
  }
}

try {
  // No available ports in range
  await findAvailablePort({ 
    startPort: 80, 
    endPort: 90, // Likely all in use
    maxTries: 5 
  });
} catch (error) {
  if (error instanceof PortError) {
    console.error('No available ports found:', error.message);
  }
}

// Safe port checking with fallbacks
const safePortCheck = async (port: number, fallbackRange: [number, number] = [3000, 4000]) => {
  try {
    const available = await isPortAvailable(port);
    if (available) return port;
    
    console.log(`Port ${port} not available, finding alternative...`);
    return await findAvailablePort({ 
      startPort: fallbackRange[0], 
      endPort: fallbackRange[1] 
    });
  } catch (error) {
    console.error('Port check failed:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};
```

## API Reference

### `isPortInUse(port: number, options?: PortCheckOptions): Promise<boolean>`

Checks if a specific port is currently in use.

**Parameters:**
- `port` - The port number to check (1-65535)
- `options` - Configuration options (optional)
  - `host` - The host to check (default: 'localhost')
  - `timeout` - Timeout in milliseconds (default: 5000)

**Returns:** `Promise<boolean>` - true if port is in use, false if available

**Throws:** `PortError` when port number is invalid or check fails

### `isPortAvailable(port: number, options?: PortCheckOptions): Promise<boolean>`

Checks if a specific port is available (not in use).

**Parameters:**
- `port` - The port number to check (1-65535)
- `options` - Configuration options (optional)

**Returns:** `Promise<boolean>` - true if port is available, false if in use

**Throws:** `PortError` when port number is invalid or check fails

### `findAvailablePort(options?: FindPortOptions): Promise<number>`

Finds the next available port starting from a given port number.

**Parameters:**
- `options` - Configuration options (optional)
  - `startPort` - Starting port number (default: 3000)
  - `endPort` - Ending port number (default: 65535)
  - `maxTries` - Maximum number of ports to try (default: 100)
  - `host` - The host to check (default: 'localhost')
  - `timeout` - Timeout in milliseconds (default: 5000)

**Returns:** `Promise<number>` - An available port number

**Throws:** `PortError` when no available port is found

### `checkMultiplePorts(ports: readonly number[], options?: PortCheckOptions): Promise<Map<number, boolean>>`

Checks multiple ports and returns their availability status.

**Parameters:**
- `ports` - Array of port numbers to check
- `options` - Configuration options (optional)

**Returns:** `Promise<Map<number, boolean>>` - Map with port numbers as keys and availability as values

### `waitForPort(port: number, targetState: 'available' | 'in-use', options?): Promise<void>`

Waits for a port to become available or in use.

**Parameters:**
- `port` - The port number to monitor
- `targetState` - Whether to wait for 'available' or 'in-use' state
- `options` - Configuration options (optional)
  - `host` - The host to check (default: 'localhost')
  - `timeout` - Individual check timeout (default: 5000)
  - `pollInterval` - Polling interval in milliseconds (default: 1000)
  - `overallTimeout` - Overall timeout in milliseconds (default: 30000)

**Returns:** `Promise<void>` - Resolves when port reaches target state

**Throws:** `PortError` when timeout is reached

## Type Definitions

```typescript
interface PortCheckOptions {
  /** The host to check (default: 'localhost') */
  host?: string;
  /** Timeout in milliseconds (default: 5000) */
  timeout?: number;
}

interface FindPortOptions extends PortCheckOptions {
  /** The starting port number to search from */
  startPort?: number;
  /** The ending port number to search until */
  endPort?: number;
  /** Maximum number of ports to try (default: 100) */
  maxTries?: number;
}

class PortError extends Error {
  constructor(
    message: string,
    public readonly port?: number,
    public readonly host?: string
  );
}
```

## Best Practices

1. **Use appropriate timeouts**: Set reasonable timeouts based on your network conditions
2. **Handle errors gracefully**: Always wrap port operations in try-catch blocks
3. **Choose sensible port ranges**: Use standard port ranges for specific services
4. **Implement retries**: Use `maxTries` and `waitForPort` for robust service startup
5. **Monitor service health**: Use `checkMultiplePorts` for health checking
6. **Respect rate limits**: Add delays between batch operations when needed

## Common Use Cases

### Docker Container Health Checks

```typescript
import { waitForPort, checkMultiplePorts } from 'advanced-js-kit/network/port';

const waitForContainers = async (services: Array<{name: string, port: number}>) => {
  console.log('Waiting for containers to be ready...');
  
  const promises = services.map(async service => {
    await waitForPort(service.port, 'in-use', { overallTimeout: 60000 });
    console.log(`✅ ${service.name} is ready on port ${service.port}`);
  });
  
  await Promise.all(promises);
  console.log('All containers are ready!');
};
```

### Load Balancer Configuration

```typescript
import { checkMultiplePorts } from 'advanced-js-kit/network/port';

const getHealthyUpstreams = async (upstreams: Array<{host: string, port: number}>) => {
  const checks = upstreams.map(async upstream => {
    const available = await isPortInUse(upstream.port, { 
      host: upstream.host,
      timeout: 2000 
    });
    return { ...upstream, healthy: available };
  });
  
  const results = await Promise.all(checks);
  return results.filter(upstream => upstream.healthy);
};
```

## Performance Considerations

- **Parallel Checks**: Use `checkMultiplePorts` for checking multiple ports simultaneously
- **Timeout Configuration**: Set appropriate timeouts to balance accuracy and performance
- **Network Latency**: Consider network conditions when setting timeouts
- **Resource Usage**: Port checks consume network resources; use judiciously

## License

This module is part of the advanced-js-kit package.
