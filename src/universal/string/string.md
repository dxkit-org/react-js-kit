# String Utilities

Essential string manipulation utilities for JavaScript/TypeScript applications.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions and type safety
- ✅ **Comprehensive JSDoc** - Detailed documentation for all functions
- ✅ **Error Handling** - Robust input validation and clear error messages
- ✅ **Unicode Support** - Proper handling of Unicode characters and emojis
- ✅ **Performance Optimized** - Efficient string operations
- ✅ **Zero Dependencies** - Pure JavaScript implementations

## Installation

```bash
npm install advanced-js-kit
```

## Usage

### Two Usage Patterns

You can use the string utilities in two ways:

#### 1. Individual Function Imports (Recommended)

```typescript
import { capitalize, capitalizeWords } from 'advanced-js-kit/string/capitalize';

const result1 = capitalize('hello world');      // "Hello world"
const result2 = capitalizeWords('hello world'); // "Hello World"
```

#### 2. Package Import

```typescript
import { capitalize, capitalizeWords } from 'advanced-js-kit';

const result1 = capitalize('hello world');      // "Hello world"
const result2 = capitalizeWords('hello world'); // "Hello World"
```

### Basic String Operations

```typescript
import { capitalize, capitalizeWords } from 'advanced-js-kit/string/capitalize';

// Capitalize first letter only
const sentence = capitalize('hello world');
console.log(sentence); // "Hello world"

const name = capitalize('john');
console.log(name); // "John"

// Capitalize each word
const title = capitalizeWords('the quick brown fox');
console.log(title); // "The Quick Brown Fox"

const fullName = capitalizeWords('john doe smith');
console.log(fullName); // "John Doe Smith"

// Handle empty strings and edge cases
const empty = capitalize('');        // ""
const single = capitalize('a');      // "A"
const already = capitalize('Hello'); // "Hello"
```

### Advanced Usage Examples

```typescript
import { capitalize, capitalizeWords } from 'advanced-js-kit/string/capitalize';

// Text formatting for user interfaces
class TextFormatter {
  static formatDisplayName(name: string): string {
    return capitalizeWords(name.toLowerCase().trim());
  }
  
  static formatSentence(text: string): string {
    return capitalize(text.toLowerCase().trim());
  }
  
  static formatTitle(title: string): string {
    // Handle articles and prepositions differently
    const words = title.toLowerCase().split(' ');
    const articles = ['a', 'an', 'the'];
    const prepositions = ['of', 'in', 'on', 'at', 'by', 'for', 'with', 'to'];
    
    return words.map((word, index) => {
      // Always capitalize first and last word
      if (index === 0 || index === words.length - 1) {
        return capitalize(word);
      }
      
      // Don't capitalize articles and short prepositions
      if (articles.includes(word) || prepositions.includes(word)) {
        return word;
      }
      
      return capitalize(word);
    }).join(' ');
  }
}

// Examples
console.log(TextFormatter.formatDisplayName('JOHN DOE'));     // "John Doe"
console.log(TextFormatter.formatSentence('THIS IS A TEST')); // "This is a test"
console.log(TextFormatter.formatTitle('the lord of the rings')); // "The Lord of the Rings"

// Form field processing
const processFormData = (formData: Record<string, string>) => {
  return {
    firstName: capitalize(formData.firstName?.trim() || ''),
    lastName: capitalize(formData.lastName?.trim() || ''),
    fullName: capitalizeWords(`${formData.firstName} ${formData.lastName}`.trim()),
    bio: capitalize(formData.bio?.trim() || '')
  };
};

// Blog post processing
class BlogPostProcessor {
  static formatTitle(title: string): string {
    return capitalizeWords(title.trim());
  }
  
  static formatAuthorName(author: string): string {
    return capitalizeWords(author.trim());
  }
  
  static formatTags(tags: string[]): string[] {
    return tags.map(tag => capitalize(tag.toLowerCase().trim()));
  }
  
  static formatExcerpt(content: string, maxLength: number = 150): string {
    const cleanContent = content.trim();
    if (cleanContent.length <= maxLength) {
      return capitalize(cleanContent);
    }
    
    // Find the last complete word within the limit
    const truncated = cleanContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const excerpt = lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
    
    return capitalize(excerpt) + '...';
  }
}

// Example usage
const blogPost = {
  title: 'understanding javascript closures',
  author: 'jane doe',
  content: 'closures are one of the most powerful features in javascript...',
  tags: ['javascript', 'programming', 'web development']
};

const formattedPost = {
  title: BlogPostProcessor.formatTitle(blogPost.title),
  author: BlogPostProcessor.formatAuthorName(blogPost.author),
  excerpt: BlogPostProcessor.formatExcerpt(blogPost.content),
  tags: BlogPostProcessor.formatTags(blogPost.tags)
};

console.log(formattedPost);
// {
//   title: "Understanding Javascript Closures",
//   author: "Jane Doe",
//   excerpt: "Closures are one of the most powerful features in javascript...",
//   tags: ["Javascript", "Programming", "Web development"]
// }
```

### Database and API Processing

```typescript
import { capitalize, capitalizeWords } from 'advanced-js-kit/string/capitalize';

// User data processing from APIs
interface RawUser {
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
}

interface ProcessedUser {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  displayName: string;
  bio?: string;
}

const processUserData = (rawUser: RawUser): ProcessedUser => {
  const firstName = capitalize(rawUser.first_name?.toLowerCase() || '');
  const lastName = capitalize(rawUser.last_name?.toLowerCase() || '');
  
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    email: rawUser.email.toLowerCase(),
    displayName: capitalizeWords(`${firstName} ${lastName}`.trim()),
    bio: rawUser.bio ? capitalize(rawUser.bio.trim()) : undefined
  };
};

// Product data processing
interface RawProduct {
  name: string;
  category: string;
  description: string;
  tags: string[];
}

const processProductData = (rawProduct: RawProduct) => ({
  name: capitalizeWords(rawProduct.name),
  category: capitalize(rawProduct.category),
  description: capitalize(rawProduct.description),
  tags: rawProduct.tags.map(tag => capitalize(tag.toLowerCase()))
});

// CSV data processing
const processCsvRow = (row: string[]): string[] => {
  return row.map(cell => {
    const trimmed = cell.trim();
    
    // Check if it looks like a name (contains letters and spaces)
    if (/^[a-zA-Z\s]+$/.test(trimmed)) {
      return capitalizeWords(trimmed.toLowerCase());
    }
    
    // Check if it's a sentence (starts with letter, contains spaces)
    if (/^[a-zA-Z].*\s/.test(trimmed)) {
      return capitalize(trimmed.toLowerCase());
    }
    
    return trimmed;
  });
};
```

### Internationalization Support

```typescript
import { capitalize, capitalizeWords } from 'advanced-js-kit/string/capitalize';

// Multi-language text processing
class InternationalTextProcessor {
  static formatName(name: string, locale: string = 'en'): string {
    // For most Western languages, capitalize words
    if (['en', 'es', 'fr', 'de', 'it'].includes(locale)) {
      return capitalizeWords(name.toLowerCase());
    }
    
    // For other languages, just capitalize first letter
    return capitalize(name.toLowerCase());
  }
  
  static formatSentence(text: string, locale: string = 'en'): string {
    return capitalize(text.toLowerCase());
  }
  
  static formatAddress(address: string, locale: string = 'en'): string {
    // Split by commas and capitalize each part
    return address
      .split(',')
      .map(part => capitalizeWords(part.trim().toLowerCase()))
      .join(', ');
  }
}

// Unicode and emoji support
const formatTextWithEmojis = (text: string): string => {
  // The functions handle Unicode characters properly
  const textWithEmojis = '🚀 hello world! 你好世界';
  return capitalize(textWithEmojis); // "🚀 hello world! 你好世界"
};

// Accent and special character support
const examples = [
  capitalize('josé maría'),      // "José maría"
  capitalizeWords('café münü'), // "Café Münü"
  capitalize('naïve résumé'),    // "Naïve résumé"
  capitalizeWords('naïve résumé') // "Naïve Résumé"
];
```

### Content Management Systems

```typescript
import { capitalize, capitalizeWords } from 'advanced-js-kit/string/capitalize';

// CMS content processing
class ContentProcessor {
  static processHeading(heading: string, level: number): string {
    switch (level) {
      case 1: // Main title - capitalize all words
        return capitalizeWords(heading.trim());
      case 2: // Subtitle - capitalize all words
        return capitalizeWords(heading.trim());
      case 3: // Section - capitalize first word and proper nouns
        return capitalize(heading.trim());
      default:
        return capitalize(heading.trim());
    }
  }
  
  static processMetaTitle(title: string): string {
    return capitalizeWords(title.trim());
  }
  
  static processMetaDescription(description: string): string {
    return capitalize(description.trim());
  }
  
  static processMenuItem(menuItem: string): string {
    return capitalizeWords(menuItem.trim());
  }
  
  static processBreadcrumb(crumb: string): string {
    return capitalize(crumb.replace(/[-_]/g, ' ').trim());
  }
}

// SEO-friendly URL to title conversion
const urlToTitle = (url: string): string => {
  return capitalizeWords(
    url
      .split('/')
      .pop()                    // Get last segment
      ?.replace(/[-_]/g, ' ')   // Replace hyphens/underscores with spaces
      ?.replace(/\.[^.]*$/, '') // Remove file extension
      || ''
  );
};

// Examples
console.log(urlToTitle('/blog/understanding-javascript-closures')); // "Understanding Javascript Closures"
console.log(urlToTitle('/products/smart-phone-case.html'));          // "Smart Phone Case"
```

### Form Validation and Formatting

```typescript
import { capitalize, capitalizeWords } from 'advanced-js-kit/string/capitalize';

// Form field formatters
const formatters = {
  name: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return capitalizeWords(value.trim().toLowerCase());
  },
  
  city: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return capitalizeWords(value.trim().toLowerCase());
  },
  
  sentence: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return capitalize(value.trim().toLowerCase());
  },
  
  title: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return capitalizeWords(value.trim());
  }
};

// Auto-formatting form handler
const handleFormInput = (fieldName: string, value: string): string => {
  const formatter = formatters[fieldName as keyof typeof formatters];
  return formatter ? formatter(value) : value;
};

// React-style component example
const AutoFormattingInput = {
  formatOnBlur: (event: { target: { name: string; value: string } }) => {
    const { name, value } = event.target;
    const formattedValue = handleFormInput(name, value);
    
    // Update the input value
    event.target.value = formattedValue;
    
    return formattedValue;
  }
};

// Validation with formatting
const validateAndFormat = (value: string, type: 'name' | 'title' | 'sentence'): { 
  isValid: boolean; 
  formatted: string; 
  error?: string; 
} => {
  if (!value || typeof value !== 'string') {
    return { isValid: false, formatted: '', error: 'Value is required' };
  }
  
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { isValid: false, formatted: '', error: 'Value cannot be empty' };
  }
  
  let formatted: string;
  switch (type) {
    case 'name':
      formatted = capitalizeWords(trimmed.toLowerCase());
      break;
    case 'title':
      formatted = capitalizeWords(trimmed);
      break;
    case 'sentence':
      formatted = capitalize(trimmed.toLowerCase());
      break;
    default:
      formatted = trimmed;
  }
  
  return { isValid: true, formatted };
};
```

### Error Handling

```typescript
import { capitalize, capitalizeWords } from 'advanced-js-kit/string/capitalize';

try {
  // These will throw errors due to invalid input types
  capitalize(123 as any);
  capitalizeWords(null as any);
} catch (error) {
  console.error(error.message); // "Input must be a string"
}

// Safe string processing with validation
const safeCapitalize = (input: unknown): string => {
  if (typeof input !== 'string') {
    console.warn('Input is not a string, converting...');
    return capitalize(String(input));
  }
  
  return capitalize(input);
};

const safeCapitalizeWords = (input: unknown): string => {
  if (typeof input !== 'string') {
    console.warn('Input is not a string, converting...');
    return capitalizeWords(String(input));
  }
  
  return capitalizeWords(input);
};

// Null-safe string operations
const processStringField = (value: any, formatter: 'capitalize' | 'capitalizeWords' = 'capitalize'): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value).trim();
  
  if (stringValue.length === 0) {
    return '';
  }
  
  try {
    return formatter === 'capitalize' 
      ? capitalize(stringValue)
      : capitalizeWords(stringValue);
  } catch (error) {
    console.error('String formatting error:', error);
    return stringValue;
  }
};

// Batch processing with error handling
const processStringArray = (strings: unknown[]): string[] => {
  return strings
    .map((item, index) => {
      try {
        return typeof item === 'string' ? capitalize(item) : '';
      } catch (error) {
        console.error(`Error processing item at index ${index}:`, error);
        return '';
      }
    })
    .filter(str => str.length > 0);
};
```

## API Reference

### `capitalize(str: string): string`

Capitalizes the first letter of a string.

**Parameters:**
- `str` - The string to capitalize

**Returns:** `string` - The string with the first letter capitalized

**Throws:** `Error` when input is not a string

**Examples:**
```typescript
capitalize('hello');           // "Hello"
capitalize('hello world');     // "Hello world"
capitalize('HELLO');           // "HELLO"
capitalize('');                // ""
capitalize('a');               // "A"
capitalize('123abc');          // "123abc"
```

### `capitalizeWords(str: string): string`

Capitalizes the first letter of each word in a string.

**Parameters:**
- `str` - The string to capitalize

**Returns:** `string` - The string with each word's first letter capitalized

**Throws:** `Error` when input is not a string

**Examples:**
```typescript
capitalizeWords('hello world');        // "Hello World"
capitalizeWords('the quick brown');    // "The Quick Brown"
capitalizeWords('hello-world');        // "Hello-World"
capitalizeWords('hello_world');        // "Hello_World"
capitalizeWords('hello   world');      // "Hello   World"
capitalizeWords('');                   // ""
```

## Best Practices

1. **Always validate input types**: Use TypeScript or runtime checks to ensure string inputs
2. **Handle edge cases**: Consider empty strings, single characters, and whitespace
3. **Preserve original spacing**: Functions maintain original whitespace and punctuation
4. **Use appropriate function**: Choose `capitalize` for sentences, `capitalizeWords` for titles
5. **Consider internationalization**: Test with Unicode characters and different languages
6. **Combine with trim()**: Often useful to trim whitespace before capitalizing
7. **Handle null/undefined**: Implement safe wrappers for potentially undefined inputs

## Common Use Cases

### User Interface Text

```typescript
import { capitalize, capitalizeWords } from 'advanced-js-kit/string/capitalize';

// Button labels
const buttonLabels = ['save changes', 'cancel', 'submit form'].map(capitalizeWords);
// Result: ['Save Changes', 'Cancel', 'Submit Form']

// Menu items
const menuItems = ['home', 'about us', 'contact'].map(capitalizeWords);
// Result: ['Home', 'About Us', 'Contact']

// Status messages
const statusMessage = capitalize('operation completed successfully');
// Result: "Operation completed successfully"
```

### Data Processing

```typescript
// CSV column headers
const headers = ['first name', 'last name', 'email address'].map(capitalizeWords);
// Result: ['First Name', 'Last Name', 'Email Address']

// Database field formatting
const formatDatabaseRecord = (record: any) => ({
  ...record,
  name: capitalizeWords(record.name?.toLowerCase() || ''),
  title: capitalize(record.title?.toLowerCase() || ''),
  description: capitalize(record.description?.toLowerCase() || '')
});
```

### Content Management

```typescript
// Blog post titles
const formatBlogTitle = (title: string): string => {
  return capitalizeWords(title.trim());
};

// Article excerpts
const formatExcerpt = (content: string, length: number = 150): string => {
  const excerpt = content.substring(0, length);
  return capitalize(excerpt.trim()) + (content.length > length ? '...' : '');
};
```

## Performance Considerations

- **String immutability**: Functions create new strings, original strings are unchanged
- **Unicode support**: Proper handling of Unicode characters including emojis
- **Regular expressions**: `capitalizeWords` uses regex for efficient word boundary detection
- **Minimal overhead**: Simple string operations with minimal processing overhead

## License

This module is part of the advanced-js-kit package.
