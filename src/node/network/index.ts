import isPortReachable from "is-port-reachable";
import { assertNodeEnvironment, EnvironmentError } from "../../universal/utils";

/**
 * Options for port checking operations
 */
export interface PortCheckOptions {
  /** The host to check (default: 'localhost') */
  host?: string;
  /** Timeout in milliseconds (default: 5000) */
  timeout?: number;
}

/**
 * Options for finding an available port
 */
export interface FindPortOptions extends PortCheckOptions {
  /** The starting port number to search from */
  startPort?: number;
  /** The ending port number to search until */
  endPort?: number;
  /** Maximum number of ports to try (default: 100) */
  maxTries?: number;
}

/**
 * Custom error class for port-related operations
 */
export class PortError extends Error {
  constructor(
    message: string,
    public readonly port?: number,
    public readonly host?: string
  ) {
    super(message);
    this.name = 'PortError';
  }
}

/**
 * Validates if a port number is within the valid range
 * @param port - The port number to validate
 * @throws {PortError} When port is not within valid range (1-65535)
 */
const validatePort = (port: number): void => {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new PortError(`Invalid port number: ${port}. Must be an integer between 1 and 65535.`, port);
  }
};

/**
 * Checks if a specific port is currently in use
 * 
 * @param port - The port number to check (1-65535)
 * @param options - Configuration options for the port check
 * @returns Promise that resolves to true if the port is in use, false otherwise
 * 
 * @throws {PortError} When port number is invalid or check fails
 * 
 * @example
 * ```typescript
 * // Check if port 3000 is in use on localhost
 * const inUse = await isPortInUse(3000);
 * console.log(`Port 3000 is ${inUse ? 'in use' : 'available'}`);
 * 
 * // Check a port on a different host with custom timeout
 * const inUse = await isPortInUse(8080, { host: '192.168.1.100', timeout: 3000 });
 * ```
 */
export const isPortInUse = async (
  port: number,
  options: PortCheckOptions = {}
): Promise<boolean> => {
  // Check if running in Node.js environment
  assertNodeEnvironment();
  
  validatePort(port);
  
  const { host = 'localhost', timeout = 5000 } = options;
  
  try {
    return await isPortReachable(port, { host, timeout });
  } catch (error) {
    throw new PortError(
      `Failed to check port ${port} on ${host}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      port,
      host
    );
  }
};

/**
 * Checks if a specific port is available (not in use)
 * 
 * @param port - The port number to check (1-65535)
 * @param options - Configuration options for the port check
 * @returns Promise that resolves to true if the port is available, false otherwise
 * 
 * @throws {PortError} When port number is invalid or check fails
 * 
 * @example
 * ```typescript
 * // Check if port 3000 is available
 * const available = await isPortAvailable(3000);
 * if (available) {
 *   console.log('Port 3000 is ready to use!');
 * }
 * ```
 */
export const isPortAvailable = async (
  port: number,
  options: PortCheckOptions = {}
): Promise<boolean> => {
  return !(await isPortInUse(port, options));
};

/**
 * Finds the next available port starting from a given port number
 * 
 * @param options - Configuration options for finding an available port
 * @returns Promise that resolves to an available port number
 * 
 * @throws {PortError} When no available port is found within the specified range
 * 
 * @example
 * ```typescript
 * // Find any available port starting from 3000
 * const port = await findAvailablePort({ startPort: 3000 });
 * console.log(`Found available port: ${port}`);
 * 
 * // Find port within a specific range
 * const port = await findAvailablePort({ 
 *   startPort: 8000, 
 *   endPort: 8100,
 *   host: '0.0.0.0'
 * });
 * ```
 */
export const findAvailablePort = async (
  options: FindPortOptions = {}
): Promise<number> => {
  const {
    startPort = 3000,
    endPort = 65535,
    maxTries = 100,
    host = 'localhost',
    timeout = 5000
  } = options;
  
  validatePort(startPort);
  validatePort(endPort);
  
  if (startPort > endPort) {
    throw new PortError(`Start port (${startPort}) cannot be greater than end port (${endPort})`);
  }
  
  let currentPort = startPort;
  let attempts = 0;
  
  while (currentPort <= endPort && attempts < maxTries) {
    try {
      const available = await isPortAvailable(currentPort, { host, timeout });
      if (available) {
        return currentPort;
      }
    } catch (error) {
      // Continue to next port if there's an error checking this one
      console.warn(`Error checking port ${currentPort}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    currentPort++;
    attempts++;
  }
  
  throw new PortError(
    `No available port found in range ${startPort}-${endPort} after ${attempts} attempts`,
    undefined,
    host
  );
};

/**
 * Checks multiple ports and returns their availability status
 * 
 * @param ports - Array of port numbers to check
 * @param options - Configuration options for the port checks
 * @returns Promise that resolves to a Map with port numbers as keys and availability status as values
 * 
 * @example
 * ```typescript
 * // Check multiple ports at once
 * const results = await checkMultiplePorts([3000, 3001, 3002, 8080]);
 * results.forEach((available, port) => {
 *   console.log(`Port ${port}: ${available ? 'available' : 'in use'}`);
 * });
 * ```
 */
export const checkMultiplePorts = async (
  ports: readonly number[],
  options: PortCheckOptions = {}
): Promise<Map<number, boolean>> => {
  const results = new Map<number, boolean>();
  
  // Validate all ports first
  ports.forEach(validatePort);
  
  // Check all ports in parallel
  const checks = ports.map(async (port) => {
    try {
      const available = await isPortAvailable(port, options);
      return { port, available };
    } catch (error) {
      console.warn(`Error checking port ${port}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { port, available: false };
    }
  });
  
  const checkResults = await Promise.all(checks);
  
  checkResults.forEach(({ port, available }) => {
    results.set(port, available);
  });
  
  return results;
};

/**
 * Waits for a port to become available or in use
 * 
 * @param port - The port number to monitor
 * @param targetState - Whether to wait for 'available' or 'in-use' state
 * @param options - Configuration options including polling interval and timeout
 * @returns Promise that resolves when the port reaches the target state
 * 
 * @throws {PortError} When timeout is reached or port validation fails
 * 
 * @example
 * ```typescript
 * // Wait for a service to start on port 3000
 * await waitForPort(3000, 'in-use', { timeout: 30000 });
 * console.log('Service is now running on port 3000');
 * 
 * // Wait for a port to be freed up
 * await waitForPort(3000, 'available');
 * console.log('Port 3000 is now available');
 * ```
 */
export const waitForPort = async (
  port: number,
  targetState: 'available' | 'in-use',
  options: PortCheckOptions & { 
    /** Polling interval in milliseconds (default: 1000) */
    pollInterval?: number;
    /** Overall timeout in milliseconds (default: 30000) */
    overallTimeout?: number;
  } = {}
): Promise<void> => {
  validatePort(port);
  
  const {
    host = 'localhost',
    timeout = 5000,
    pollInterval = 1000,
    overallTimeout = 30000
  } = options;
  
  const startTime = Date.now();
  
  while (Date.now() - startTime < overallTimeout) {
    try {
      const inUse = await isPortInUse(port, { host, timeout });
      const currentState = inUse ? 'in-use' : 'available';
      
      if (currentState === targetState) {
        return;
      }
    } catch (error) {
      // Continue polling on errors
      console.warn(`Error checking port ${port}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  throw new PortError(
    `Timeout waiting for port ${port} to become ${targetState} after ${overallTimeout}ms`,
    port,
    host
  );
};