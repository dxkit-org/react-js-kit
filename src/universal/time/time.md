# Time Utilities

Essential time conversion utilities for JavaScript/TypeScript applications with flexible time unit handling.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions and type safety
- ✅ **Comprehensive JSDoc** - Detailed documentation for all functions
- ✅ **Flexible Time Units** - Support for seconds, minutes, hours, days, months, years
- ✅ **Mixed Unit Conversion** - Combine multiple time units in a single call
- ✅ **Error Handling** - Robust input validation and clear error messages
- ✅ **Performance Optimized** - Efficient time calculations
- ✅ **Zero Dependencies** - Pure JavaScript implementations

## Installation

```bash
npm install advanced-js-kit
```

## Usage

### Two Usage Patterns

You can use the time utilities in two ways:

#### 1. Individual Function Imports (Recommended)

```typescript
import { convertToSeconds } from 'advanced-js-kit/time/time';

const totalSeconds = convertToSeconds({ hours: 2, minutes: 30 }); // 9000 seconds
```

#### 2. Package Import

```typescript
import { convertToSeconds } from 'advanced-js-kit';

const totalSeconds = convertToSeconds({ hours: 2, minutes: 30 }); // 9000 seconds
```

### Basic Time Conversion

```typescript
import { convertToSeconds } from 'advanced-js-kit/time/time';

// Single unit conversions
const oneMinute = convertToSeconds({ minutes: 1 });        // 60 seconds
const oneHour = convertToSeconds({ hours: 1 });            // 3600 seconds
const oneDay = convertToSeconds({ days: 1 });              // 86400 seconds
const oneMonth = convertToSeconds({ months: 1 });          // 2592000 seconds (30 days)
const oneYear = convertToSeconds({ years: 1 });            // 31536000 seconds (365 days)

// No parameters - returns 0
const zero = convertToSeconds();                            // 0 seconds
```

### Mixed Unit Conversions

```typescript
import { convertToSeconds } from 'advanced-js-kit/time/time';

// Combine multiple time units
const complexTime = convertToSeconds({
  years: 1,
  months: 6,
  days: 15,
  hours: 8,
  minutes: 30,
  seconds: 45
});
// Result: 47,347,845 seconds (1 year, 6 months, 15 days, 8 hours, 30 minutes, 45 seconds)

// Common combinations
const workingDay = convertToSeconds({ hours: 8 });         // 28800 seconds (8-hour workday)
const workingWeek = convertToSeconds({ days: 5, hours: 8 }); // 172800 seconds (5 working days)
const semester = convertToSeconds({ months: 4 });          // 10368000 seconds (4-month semester)
```

### Practical Examples

```typescript
import { convertToSeconds } from 'advanced-js-kit/time/time';

// Event planning
const conferenceLength = convertToSeconds({ 
  days: 3, 
  hours: 8 
}); // 3-day conference, 8 hours per day

// Project timeline
const sprintDuration = convertToSeconds({ 
  days: 14 
}); // 2-week sprint

// Cache expiration
const cacheExpiry = convertToSeconds({ 
  hours: 24 
}); // 24-hour cache

// Session timeout
const sessionTimeout = convertToSeconds({ 
  minutes: 30 
}); // 30-minute session

// File retention
const logRetention = convertToSeconds({ 
  days: 90 
}); // 90-day log retention

// Subscription period
const monthlySubscription = convertToSeconds({ 
  months: 1 
}); // 1-month subscription

// Academic year
const academicYear = convertToSeconds({ 
  months: 10 
}); // 10-month academic year
```

### Integration with Date/Time APIs

```typescript
import { convertToSeconds } from 'advanced-js-kit/time/time';

// Creating future dates
const futureTime = convertToSeconds({ days: 7, hours: 12 });
const futureDate = new Date(Date.now() + (futureTime * 1000));

// Setting timeouts
const delaySeconds = convertToSeconds({ minutes: 5 });
setTimeout(() => {
  console.log('5 minutes have passed');
}, delaySeconds * 1000);

// Cache expiration with Redis/memory stores
const cacheExpirySeconds = convertToSeconds({ hours: 2 });
// Use cacheExpirySeconds with your caching solution

// Database timestamp calculations
const archiveAfter = convertToSeconds({ years: 1 });
const archiveTimestamp = Math.floor(Date.now() / 1000) + archiveAfter;
```

### Working with APIs and Services

```typescript
import { convertToSeconds } from 'advanced-js-kit/time/time';

// JWT token expiration
const tokenExpiry = convertToSeconds({ hours: 2 }); // 2-hour token
const jwtPayload = {
  userId: '123',
  exp: Math.floor(Date.now() / 1000) + tokenExpiry
};

// Rate limiting
const rateLimitWindow = convertToSeconds({ minutes: 15 }); // 15-minute window
const maxRequests = 100;

// Scheduled tasks
const dailyBackup = convertToSeconds({ days: 1 }); // Run every 24 hours
const weeklyReport = convertToSeconds({ days: 7 }); // Run every 7 days

// Health check intervals
const healthCheckInterval = convertToSeconds({ seconds: 30 }); // Every 30 seconds
```

## API Reference

### `convertToSeconds(options?)`

Converts various time units to total seconds.

#### Parameters

- `options` (object, optional): Configuration object with time units
  - `seconds?` (number): Number of seconds (default: 0)
  - `minutes?` (number): Number of minutes (default: 0)
  - `hours?` (number): Number of hours (default: 0)
  - `days?` (number): Number of days (default: 0)
  - `months?` (number): Number of months (default: 0, assumes 30 days per month)
  - `years?` (number): Number of years (default: 0, assumes 365 days per year)

#### Returns

- `number`: Total time converted to seconds

#### Examples

```typescript
// Basic usage
convertToSeconds({ minutes: 5 });                    // 300
convertToSeconds({ hours: 2, minutes: 30 });         // 9000
convertToSeconds({ days: 1, hours: 12 });            // 129600

// Complex combinations
convertToSeconds({ 
  years: 1, 
  months: 6, 
  days: 15, 
  hours: 8, 
  minutes: 30, 
  seconds: 45 
}); // 47347845

// Edge cases
convertToSeconds();                                   // 0
convertToSeconds({});                                 // 0
```

## Time Conversion Reference

### Quick Reference Table

| Unit     | Seconds | Minutes | Hours   | Days      |
|----------|---------|---------|---------|-----------|
| 1 second | 1       | 0.0167  | 0.0003  | 0.000012  |
| 1 minute | 60      | 1       | 0.0167  | 0.0007    |
| 1 hour   | 3,600   | 60      | 1       | 0.0417    |
| 1 day    | 86,400  | 1,440   | 24      | 1         |
| 1 month* | 2,592,000 | 43,200 | 720    | 30        |
| 1 year*  | 31,536,000 | 525,600 | 8,760 | 365       |

*Note: Months are calculated as 30 days, years as 365 days for consistency.

### Common Durations in Seconds

```typescript
// Common time periods
const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;
const MONTH = 2592000;    // 30 days
const YEAR = 31536000;    // 365 days

// Using the utility
const minute = convertToSeconds({ minutes: 1 });     // 60
const hour = convertToSeconds({ hours: 1 });         // 3600
const day = convertToSeconds({ days: 1 });           // 86400
const week = convertToSeconds({ days: 7 });          // 604800
const month = convertToSeconds({ months: 1 });       // 2592000
const year = convertToSeconds({ years: 1 });         // 31536000
```

## Best Practices

### 1. **Use Descriptive Variable Names**

```typescript
// ✅ Good
const sessionTimeoutSeconds = convertToSeconds({ minutes: 30 });
const cacheExpirationSeconds = convertToSeconds({ hours: 24 });

// ❌ Avoid
const timeout = convertToSeconds({ minutes: 30 });
const expiry = convertToSeconds({ hours: 24 });
```

### 2. **Combine Units for Clarity**

```typescript
// ✅ Good - Clear intent
const workingWeek = convertToSeconds({ days: 5, hours: 8 }); // 5 days × 8 hours
const semester = convertToSeconds({ months: 4, days: 15 }); // 4.5 months

// ✅ Also good - Single unit if appropriate
const oneWeek = convertToSeconds({ days: 7 });
```

### 3. **Document Assumptions**

```typescript
// ✅ Good - Document assumptions in comments
const projectDuration = convertToSeconds({ 
  months: 6  // Assuming 30-day months for planning purposes
});

const fiscalYear = convertToSeconds({ 
  years: 1   // Standard 365-day year
});
```

### 4. **Consider Leap Years and Variable Month Lengths**

For precise calculations involving calendar dates, consider using date libraries like `date-fns` or `moment.js`. This utility is best for:
- Approximate calculations
- Configuration values
- Timeout/interval settings
- Performance measurements

## Performance

The `convertToSeconds` function is highly optimized:

- **O(1) time complexity** - Constant time execution
- **Minimal memory usage** - No arrays or complex objects created
- **Pure function** - No side effects, safe for concurrent use
- **Integer arithmetic** - Fast mathematical operations only

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
interface TimeOptions {
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  months?: number;
  years?: number;
}

function convertToSeconds(options?: TimeOptions): number;
```

## Error Handling

The function includes robust input validation:

```typescript
// All these work safely
convertToSeconds();                           // Returns 0
convertToSeconds({});                         // Returns 0
convertToSeconds({ minutes: undefined });     // Treats as 0
convertToSeconds({ hours: null });            // Treats as 0

// Type safety in TypeScript prevents invalid inputs
convertToSeconds({ minutes: "5" });          // TypeScript error
convertToSeconds({ invalid: 10 });           // TypeScript error
```

## Contributing

Found a bug or want to contribute? Check out our [contributing guidelines](../../CONTRIBUTING.md).

## License

MIT License - see [LICENSE](../../LICENSE) for details.