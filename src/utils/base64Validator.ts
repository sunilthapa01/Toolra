import { ValidationError } from './jsonValidator';

/**
 * Validates a Base64 string and returns a list of errors/warnings.
 * This is client-side only and secure.
 */
export const validateBase64 = (text: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const trimmed = text.trim();

  if (!trimmed) {
    return [
      {
        line: 1,
        column: 1,
        message: 'Input is empty.',
        severity: 'warning',
      },
    ];
  }

  // 1. Check for invalid characters character-by-character
  // Base64 alphabet: A-Z, a-z, 0-9, +, / and =
  // Allowed whitespace: space, tab, carriage return, newline
  let line = 1;
  let col = 1;
  let nonWhitespaceCount = 0;
  let firstEqualsIdx: number | null = null;
  let totalEqualsCount = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '\n') {
      line++;
      col = 1;
      continue;
    }

    if (char === '\r' || char === '\t' || char === ' ') {
      col++;
      continue;
    }

    // Check if character is in Base64 alphabet
    const isValidBase64Char = /^[A-Za-z0-9+/=]$/.test(char);
    if (!isValidBase64Char) {
      errors.push({
        line,
        column: col,
        message: `Invalid Base64 character '${char}'. Only alphanumeric characters (A-Z, a-z, 0-9), '+', '/', and '=' are allowed.`,
        severity: 'error',
        startIdx: i,
        endIdx: i + 1,
      });
    }

    if (char === '=') {
      totalEqualsCount++;
      if (firstEqualsIdx === null) {
        firstEqualsIdx = nonWhitespaceCount;
      }
    } else {
      // If we already saw an '=', and we now see a non-equals char, that is invalid padding sequence
      if (firstEqualsIdx !== null) {
        errors.push({
          line,
          column: col,
          message: `Invalid padding position. Padding characters '=' must only appear at the very end of the string.`,
          severity: 'error',
          startIdx: i,
          endIdx: i + 1,
        });
      }
    }

    nonWhitespaceCount++;
    col++;
  }

  // If there are already structural errors in characters, we can skip other length checks
  if (errors.length > 0) {
    return errors;
  }

  // 2. Padding and structure validation
  // Strip all whitespace for structural checks
  const rawStr = text.replace(/\s/g, '');
  const len = rawStr.length;

  if (totalEqualsCount > 2) {
    // Find where the third equals is
    let count = 0;
    let foundLine = 1;
    let foundCol = 1;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '\n') { foundLine++; foundCol = 1; continue; }
      if (char === '\r' || char === '\t' || char === ' ') { foundCol++; continue; }
      if (char === '=') {
        count++;
        if (count > 2) {
          errors.push({
            line: foundLine,
            column: foundCol,
            message: `Too many padding characters. A Base64 string can have at most 2 '=' padding characters.`,
            severity: 'error',
            startIdx: i,
            endIdx: i + 1,
          });
          break;
        }
      }
      foundCol++;
    }
  }

  // Base64 length must be a multiple of 4.
  if (len % 4 !== 0) {
    // Check if it is unpadded (lengths 2 or 3 mod 4 can be decoded, but length 1 mod 4 is completely invalid)
    const mod = len % 4;
    if (mod === 1) {
      errors.push({
        line: 1,
        column: 1,
        message: `Invalid Base64 length. The string length (excluding whitespace) is ${len}, which has an invalid remainder of 1 when divided by 4. This cannot be decoded.`,
        severity: 'error',
      });
    } else {
      errors.push({
        line: 1,
        column: 1,
        message: `Unpadded Base64 string. The length is ${len} (not a multiple of 4). It is missing ${4 - mod} padding character(s) ('='), but can still be decoded.`,
        severity: 'warning',
      });
    }
  }

  return errors;
};
