import  jsonwebtoken from "jsonwebtoken";
import { JwtPayload, VerifyOptions, SignOptions, Secret, SignCallback } from "jsonwebtoken";
import { assertNodeEnvironment } from "../../universal/utils";

/**
 * Type-safe error codes for JWT operations
 */
export type JwtErrorCode = 
    | 'invalid_token'
    | 'invalid_secret' 
    | 'invalid_payload'
    | 'verification_failed'
    | 'signing_failed'
    | 'token_expired'
    | 'decode_failed'
    | 'environment_error';

/**
 * Error object for JWT operations
 */
export interface JwtError {
    code: JwtErrorCode;
    message: string;
    originalError?: Error;
}

/**
 * Success result for JWT operations
 */
export interface JwtSuccessResult<T> {
    status: 'success';
    data: T;
}

/**
 * Error result for JWT operations
 */
export interface JwtErrorResult {
    status: 'error';
    error: JwtError;
}

/**
 * Result type for JWT operations
 */
export type JwtResult<T> = JwtSuccessResult<T> | JwtErrorResult;

/**
 * Generic payload type for JWT tokens
 */
export interface JwtTokenPayload extends JwtPayload {
    [key: string]: any;
}

/**
 * Input parameters for JWT verification
 */
export interface JwtVerifyInput {
    /** The JWT token to verify */
    token: string;
    /** The secret key or public key for verification */
    secret: Secret;
    /** Additional verification options */
    options?: VerifyOptions;
}

/**
 * Input parameters for JWT signing
 */
export interface JwtSignInput<T extends Record<string, any> = Record<string, any>> {
    /** The payload to sign */
    payload: T;
    /** The secret key for signing */
    secret: Secret;
    /** Additional signing options */
    options?: JwtSignOptions;
}

/**
 * Options for JWT signing
 */
export interface JwtSignOptions extends Omit<SignOptions, 'expiresIn'> {
    /** Token expiration time */
    expiresIn?: string | number;
    /** Default expiration time if not specified in payload */
    defaultExpiresIn?: string | number;
}

/**
 * Input parameters for JWT decoding
 */
export interface JwtDecodeInput {
    /** The JWT token to decode */
    token: string;
    /** Decode options */
    options?: { complete?: boolean };
}

/**
 * Input parameters for JWT expiration check
 */
export interface JwtExpirationInput {
    /** The JWT token to check */
    token: string;
}

/**
 * Verifies a JWT token and returns a result object.
 * 
 * @template T - The expected payload type
 * @param input - Object containing token, secret, and verification options
 * @returns Promise that resolves to a result object with status and either data or error
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const result = await jwtVerify<{ userId: string }>({
 *   token: 'your-jwt-token',
 *   secret: 'your-secret'
 * });
 * if (result.status === 'success') {
 *   console.log('User ID:', result.data.userId);
 * } else {
 *   console.log('Error:', result.error.code, result.error.message);
 * }
 * 
 * // With custom options
 * const result = await jwtVerify({
 *   token: 'your-jwt-token',
 *   secret: 'your-secret',
 *   options: { 
 *     audience: 'my-app',
 *     issuer: 'my-service'
 *   }
 * });
 * ```
 */
export async function jwtVerify<T extends JwtTokenPayload = JwtTokenPayload>(
    input: JwtVerifyInput
): Promise<JwtResult<T>> {
    const { token, secret, options = {} } = input;

    try {
        // Check if running in Node.js environment
        assertNodeEnvironment();
    } catch (error) {
        return {
            status: 'error',
            error: {
                code: 'environment_error',
                message: 'JWT operations are only supported in Node.js environment',
                originalError: error as Error
            }
        };
    }

    return new Promise<JwtResult<T>>((resolve) => {
        if (!token || typeof token !== 'string') {
            return resolve({
                status: 'error',
                error: {
                    code: 'invalid_token',
                    message: 'Invalid token: Token must be a non-empty string'
                }
            });
        }

        if (!secret) {
            return resolve({
                status: 'error',
                error: {
                    code: 'invalid_secret',
                    message: 'Invalid secret: Secret is required for token verification'
                }
            });
        }

        jsonwebtoken.verify(token, secret, options, (err, decoded) => {
            if (err) {
                return resolve({
                    status: 'error',
                    error: {
                        code: 'verification_failed',
                        message: `JWT verification failed: ${err.message}`,
                        originalError: err
                    }
                });
            }

            // Ensure we have a valid payload object
            if (!decoded || typeof decoded === 'string') {
                return resolve({
                    status: 'error',
                    error: {
                        code: 'invalid_payload',
                        message: 'Invalid payload: Expected object payload'
                    }
                });
            }

            resolve({
                status: 'success',
                data: decoded as unknown as T
            });
        });
    });
}

/**
 * Signs a payload and creates a JWT token.
 * 
 * @template T - The payload type
 * @param input - Object containing payload, secret, and signing options
 * @returns Promise that resolves to a result object with status and either token or error
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const result = await jwtSign({
 *   payload: { userId: '123' },
 *   secret: 'your-secret'
 * });
 * if (result.status === 'success') {
 *   console.log('Token:', result.data);
 * } else {
 *   console.log('Error:', result.error.code, result.error.message);
 * }
 * 
 * // With expiration
 * const result = await jwtSign({
 *   payload: { userId: '123', role: 'admin' },
 *   secret: 'your-secret',
 *   options: { expiresIn: '1h' }
 * });
 * 
 * // With default expiration
 * const result = await jwtSign({
 *   payload: { userId: '123' },
 *   secret: 'your-secret',
 *   options: { defaultExpiresIn: '24h' }
 * });
 * ```
 */
export async function jwtSign<T extends Record<string, any> = Record<string, any>>(
    input: JwtSignInput<T>
): Promise<JwtResult<string>> {
    const { payload, secret, options = {} } = input;

    try {
        // Check if running in Node.js environment
        assertNodeEnvironment();
    } catch (error) {
        return {
            status: 'error',
            error: {
                code: 'environment_error',
                message: 'JWT operations are only supported in Node.js environment',
                originalError: error as Error
            }
        };
    }
    
    const { defaultExpiresIn, ...signOptions } = options;

    return new Promise<JwtResult<string>>((resolve) => {
        if (!payload || typeof payload !== 'object') {
            return resolve({
                status: 'error',
                error: {
                    code: 'invalid_payload',
                    message: 'Invalid payload: Payload must be an object'
                }
            });
        }

        if (!secret) {
            return resolve({
                status: 'error',
                error: {
                    code: 'invalid_secret',
                    message: 'Invalid secret: Secret is required for token signing'
                }
            });
        }

        // Apply default expiration if not already set
        const finalOptions = {
            ...signOptions,
            ...(defaultExpiresIn && !signOptions.expiresIn && { expiresIn: defaultExpiresIn })
        };

        jsonwebtoken.sign(payload, secret, finalOptions as SignOptions, (err, token) => {
            if (err) {
                return resolve({
                    status: 'error',
                    error: {
                        code: 'signing_failed',
                        message: `JWT signing failed: ${err.message}`,
                        originalError: err
                    }
                });
            }

            if (!token) {
                return resolve({
                    status: 'error',
                    error: {
                        code: 'signing_failed',
                        message: 'JWT signing failed: No token generated'
                    }
                });
            }

            resolve({
                status: 'success',
                data: token
            });
        });
    });
}

/**
 * Decodes a JWT token without verification and returns a result object.
 * Useful for inspecting token contents when verification is not required.
 * 
 * @template T - The expected payload type
 * @param input - Object containing token and decode options
 * @returns The result object with status and either decoded token or error
 * 
 * @example
 * ```typescript
 * const result = jwtDecode<{ userId: string }>({
 *   token: 'your-jwt-token'
 * });
 * if (result.status === 'success') {
 *   console.log('User ID:', result.data.userId);
 *   console.log('Expires at:', new Date(result.data.exp * 1000));
 * } else {
 *   console.log('Decode error:', result.error.code, result.error.message);
 * }
 * 
 * // With complete option
 * const result = jwtDecode({
 *   token: 'your-jwt-token',
 *   options: { complete: true }
 * });
 * ```
 */
export function jwtDecode<T extends JwtTokenPayload = JwtTokenPayload>(
    input: JwtDecodeInput
): JwtResult<T> {
    const { token, options = {} } = input;

    try {
        if (!token || typeof token !== 'string') {
            return {
                status: 'error',
                error: {
                    code: 'invalid_token',
                    message: 'Invalid token: Token must be a non-empty string'
                }
            };
        }

        const decoded = jsonwebtoken.decode(token, options);
        
        if (!decoded) {
            return {
                status: 'error',
                error: {
                    code: 'decode_failed',
                    message: 'Failed to decode token: Invalid token format'
                }
            };
        }

        return {
            status: 'success',
            data: decoded as T
        };
    } catch (error) {
        return {
            status: 'error',
            error: {
                code: 'decode_failed',
                message: `Failed to decode token: ${error instanceof Error ? error.message : 'Unknown error'}`,
                originalError: error instanceof Error ? error : undefined
            }
        };
    }
}

/**
 * Checks if a JWT token is expired without full verification and returns a result object.
 * 
 * @param input - Object containing the token to check
 * @returns Result object with status and either boolean result or error
 * 
 * @example
 * ```typescript
 * const result = jwtIsExpired({ token: 'your-jwt-token' });
 * if (result.status === 'success') {
 *   if (result.data) {
 *     console.log('Token is expired');
 *   } else {
 *     console.log('Token is still valid');
 *   }
 * } else {
 *   console.log('Error checking expiration:', result.error.code);
 * }
 * ```
 */
export function jwtIsExpired(input: JwtExpirationInput): JwtResult<boolean> {
    const { token } = input;
    const decoded = jwtDecode({ token });
    
    if (decoded.status === 'error') {
        return decoded;
    }

    if (!decoded.data.exp) {
        return {
            status: 'error',
            error: {
                code: 'invalid_payload',
                message: 'Token does not contain expiration time (exp claim)'
            }
        };
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return {
        status: 'success',
        data: decoded.data.exp < currentTime
    };
}

/**
 * Gets the remaining time until token expiration in seconds and returns a result object.
 * 
 * @param input - Object containing the token to check
 * @returns Result object with status and either remaining seconds or error
 * 
 * @example
 * ```typescript
 * const result = jwtTimeUntilExpiry({ token: 'your-jwt-token' });
 * if (result.status === 'success') {
 *   console.log(`Token expires in ${result.data} seconds`);
 * } else {
 *   console.log('Error checking expiry time:', result.error.code);
 * }
 * ```
 */
export function jwtTimeUntilExpiry(input: JwtExpirationInput): JwtResult<number> {
    const { token } = input;
    const decoded = jwtDecode({ token });
    
    if (decoded.status === 'error') {
        return decoded;
    }

    if (!decoded.data.exp) {
        return {
            status: 'error',
            error: {
                code: 'invalid_payload',
                message: 'Token does not contain expiration time (exp claim)'
            }
        };
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.data.exp - currentTime;
    
    return {
        status: 'success',
        data: timeLeft > 0 ? timeLeft : 0
    };
}

/**
 * Type guard to check if a JWT result is successful
 * 
 * @param result - The JWT result to check
 * @returns True if the result is successful
 * 
 * @example
 * ```typescript
 * const result = await jwtVerify(token, secret);
 * if (isJwtSuccess(result)) {
 *   // TypeScript knows result.data is available here
 *   console.log('User ID:', result.data.userId);
 * }
 * ```
 */
export function isJwtSuccess<T>(result: JwtResult<T>): result is JwtSuccessResult<T> {
    return result.status === 'success';
}

/**
 * Type guard to check if a JWT result is an error
 * 
 * @param result - The JWT result to check
 * @returns True if the result is an error
 * 
 * @example
 * ```typescript
 * const result = await jwtVerify(token, secret);
 * if (isJwtError(result)) {
 *   // TypeScript knows result.error is available here
 *   console.log('Error code:', result.error.code);
 * }
 * ```
 */
export function isJwtError<T>(result: JwtResult<T>): result is JwtErrorResult {
    return result.status === 'error';
}

/**
 * Extracts data from a JWT result, throwing an error if the result is not successful
 * 
 * @param result - The JWT result
 * @returns The data from the result
 * @throws Error if the result is not successful
 * 
 * @example
 * ```typescript
 * try {
 *   const result = await jwtVerify(token, secret);
 *   const payload = unwrapJwtResult(result);
 *   console.log('User ID:', payload.userId);
 * } catch (error) {
 *   console.log('JWT error:', error.message);
 * }
 * ```
 */
export function unwrapJwtResult<T>(result: JwtResult<T>): T {
    if (result.status === 'success') {
        return result.data;
    }
    throw new Error(`JWT ${result.error.code}: ${result.error.message}`);
}

/**
 * JWT utility namespace providing a convenient API for JWT operations.
 * All methods take input as objects and return result objects with status 'success' or 'error'.
 * 
 * @example
 * ```typescript
 * import { jwt } from 'advanced-js-kit/jwt/jwt';
 * 
 * // Verify a token
 * const result = await jwt.verify({
 *   token: 'your-jwt-token',
 *   secret: 'your-secret'
 * });
 * if (result.status === 'success') {
 *   console.log('Payload:', result.data);
 * } else {
 *   console.log('Error:', result.error.code, result.error.message);
 * }
 * 
 * // Sign a token
 * const signResult = await jwt.sign({
 *   payload: { userId: '123' },
 *   secret: 'your-secret'
 * });
 * if (signResult.status === 'success') {
 *   console.log('Token:', signResult.data);
 * }
 * 
 * // Decode a token
 * const decodeResult = jwt.decode({
 *   token: 'your-jwt-token'
 * });
 * 
 * // Check expiration
 * const expiredResult = jwt.isExpired({
 *   token: 'your-jwt-token'
 * });
 * ```
 */
export const jwt = {
    /**
     * Verifies a JWT token and returns a result object.
     * Alias for jwtVerify function.
     */
    verify: jwtVerify,
    
    /**
     * Signs a payload and creates a JWT token, returns a result object.
     * Alias for jwtSign function.
     */
    sign: jwtSign,
    
    /**
     * Decodes a JWT token without verification, returns a result object.
     * Alias for jwtDecode function.
     */
    decode: jwtDecode,
    
    /**
     * Checks if a JWT token is expired, returns a result object.
     * Alias for jwtIsExpired function.
     */
    isExpired: jwtIsExpired,
    
    /**
     * Gets the remaining time until token expiration, returns a result object.
     * Alias for jwtTimeUntilExpiry function.
     */
    timeUntilExpiry: jwtTimeUntilExpiry
} as const;
