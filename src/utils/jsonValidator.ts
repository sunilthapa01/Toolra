export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  startIdx?: number;
  endIdx?: number;
  explanation?: string;
  suggestion?: string;
  expected?: string;
  received?: string;
  reason?: string;
}

interface Token {
  type:
    | 'brace-open'
    | 'brace-close'
    | 'bracket-open'
    | 'bracket-close'
    | 'colon'
    | 'comma'
    | 'string'
    | 'number'
    | 'literal'
    | 'invalid'
    | 'eof';
  value: string;
  start: number;
  end: number;
  line: number;
  col: number;
  isSingleQuoted?: boolean;
  isUnquoted?: boolean;
  isUnclosed?: boolean;
}

const tokenize = (text: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let col = 1;

  const advance = (n = 1) => {
    for (let k = 0; k < n; k++) {
      if (text[i] === '\n') {
        line++;
        col = 1;
      } else {
        col++;
      }
      i++;
    }
  };

  while (i < text.length) {
    const char = text[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      advance();
      continue;
    }

    // Braces & Brackets & Colons & Commas
    if (char === '{') {
      tokens.push({ type: 'brace-open', value: '{', start: i, end: i + 1, line, col });
      advance();
      continue;
    }
    if (char === '}') {
      tokens.push({ type: 'brace-close', value: '}', start: i, end: i + 1, line, col });
      advance();
      continue;
    }
    if (char === '[') {
      tokens.push({ type: 'bracket-open', value: '[', start: i, end: i + 1, line, col });
      advance();
      continue;
    }
    if (char === ']') {
      tokens.push({ type: 'bracket-close', value: ']', start: i, end: i + 1, line, col });
      advance();
      continue;
    }
    if (char === ':') {
      tokens.push({ type: 'colon', value: ':', start: i, end: i + 1, line, col });
      advance();
      continue;
    }
    if (char === ',') {
      tokens.push({ type: 'comma', value: ',', start: i, end: i + 1, line, col });
      advance();
      continue;
    }

    // Strings
    if (char === '"' || char === "'") {
      const quoteType = char;
      const startIdx = i;
      const startLine = line;
      const startCol = col;
      advance(); // skip opening quote

      let val = '';
      let closed = false;
      while (i < text.length) {
        const nextChar = text[i];
        if (nextChar === '\\') {
          val += nextChar;
          advance();
          if (i < text.length) {
            val += text[i];
            advance();
          }
        } else if (nextChar === quoteType) {
          closed = true;
          advance(); // skip closing quote
          break;
        } else {
          val += nextChar;
          advance();
        }
      }

      tokens.push({
        type: 'string',
        value: val,
        start: startIdx,
        end: i,
        line: startLine,
        col: startCol,
        isSingleQuoted: quoteType === "'",
        isUnclosed: !closed
      });
      continue;
    }

    // Numbers
    if (/[0-9\-]/.test(char)) {
      const startIdx = i;
      const startLine = line;
      const startCol = col;
      let val = char;
      advance();
      while (i < text.length && /[0-9\.eE\+\-]/.test(text[i])) {
        val += text[i];
        advance();
      }
      tokens.push({ type: 'number', value: val, start: startIdx, end: i, line: startLine, col: startCol });
      continue;
    }

    // Literals or unquoted keys/words
    if (/[a-zA-Z_$]/.test(char)) {
      const startIdx = i;
      const startLine = line;
      const startCol = col;
      let val = char;
      advance();
      while (i < text.length && /[a-zA-Z0-9_$]/.test(text[i])) {
        val += text[i];
        advance();
      }

      const isLiteral = val === 'true' || val === 'false' || val === 'null';
      tokens.push({
        type: isLiteral ? 'literal' : 'invalid',
        value: val,
        start: startIdx,
        end: i,
        line: startLine,
        col: startCol,
        isUnquoted: !isLiteral
      });
      continue;
    }

    // Fallback for single invalid characters
    const startIdx = i;
    const startLine = line;
    const startCol = col;
    advance();
    tokens.push({
      type: 'invalid',
      value: char,
      start: startIdx,
      end: i,
      line: startLine,
      col: startCol
    });
  }

  tokens.push({ type: 'eof', value: '', start: i, end: i, line, col });
  return tokens;
};

class Parser {
  private tokens: Token[];
  private current = 0;
  public errors: ValidationError[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'eof';
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private match(type: Token['type']): boolean {
    if (this.check(type)) {
      this.advance();
      return true;
    }
    return false;
  }

  private check(type: Token['type']): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  public parseValue(): void {
    const token = this.peek();

    if (token.type === 'brace-open') {
      this.parseObject();
    } else if (token.type === 'bracket-open') {
      this.parseArray();
    } else if (token.type === 'string') {
      this.advance();
      if (token.isUnclosed) {
        this.errors.push({
          line: token.line,
          column: token.col,
          message: `Unclosed string: Expected a closing quote.`,
          severity: 'error',
          startIdx: token.start,
          endIdx: token.end,
          explanation: `A string literal was started but the file ended or a newline was reached before it was closed.`,
          suggestion: `Add a matching double quote (") at the end of the string.`
        });
      } else if (token.isSingleQuoted) {
        this.errors.push({
          line: token.line,
          column: token.col,
          message: `Invalid quotes: Strings must use double quotes.`,
          severity: 'error',
          startIdx: token.start,
          endIdx: token.end,
          explanation: `The JSON specification (RFC 8259) strictly requires double quotes (") for all string values. Single quotes (') are not allowed.`,
          suggestion: `Replace the single quotes with double quotes (e.g. 'text' -> "text").`
        });
      }
    } else if (token.type === 'number') {
      this.advance();
      if (/^\-?0\d+/.test(token.value)) {
        this.errors.push({
          line: token.line,
          column: token.col,
          message: `Unexpected number format: Leading zeros are not allowed in JSON (${token.value}).`,
          severity: 'error',
          startIdx: token.start,
          endIdx: token.end,
          explanation: `In standard JSON, numbers cannot have leading zeros (like 05 or -09) to avoid confusion with octal notations in some languages.`,
          suggestion: `Remove the leading zero (e.g. 05 -> 5 or -09 -> -9).`
        });
      }
    } else if (token.type === 'literal') {
      this.advance();
    } else if (token.type === 'invalid') {
      this.advance();
      if (token.isUnquoted) {
        this.errors.push({
          line: token.line,
          column: token.col,
          message: `Unexpected unquoted token '${token.value}'. JSON requires keys and string values to be in double quotes.`,
          severity: 'error',
          startIdx: token.start,
          endIdx: token.end,
          explanation: `An unquoted identifier '${token.value}' was found where a double-quoted string, number, or literal (true/false/null) is expected.`,
          suggestion: `Enclose the text in double quotes (e.g. ${token.value} -> "${token.value}").`
        });
      } else {
        this.errors.push({
          line: token.line,
          column: token.col,
          message: `Unexpected token '${token.value}'.`,
          severity: 'error',
          startIdx: token.start,
          endIdx: token.end,
          explanation: `The character '${token.value}' is not valid at this position in standard JSON.`,
          suggestion: `Remove this character or replace it with a valid JSON element.`
        });
      }
    } else {
      this.errors.push({
        line: token.line,
        column: token.col,
        message: `Unexpected token '${token.value || 'EOF'}'. Expected a JSON value.`,
        severity: 'error',
        startIdx: token.start,
        endIdx: token.end,
        explanation: `Expected a valid JSON value (string, number, object, array, or boolean/null literal) but found '${token.value || 'EOF'}'.`,
        suggestion: `Provide a valid JSON value, or check for missing braces or brackets.`
      });
      this.advance();
    }
  }

  private parseObject(): void {
    const openToken = this.advance();
    const keySet = new Set<string>();

    if (this.match('brace-close')) {
      return;
    }

    while (true) {
      const nextToken = this.peek();

      if (nextToken.type === 'string') {
        this.advance();
        if (nextToken.isUnclosed) {
          this.errors.push({
            line: nextToken.line,
            column: nextToken.col,
            message: `Unclosed string: Expected a closing quote.`,
            severity: 'error',
            startIdx: nextToken.start,
            endIdx: nextToken.end,
            explanation: `An object key was started but the file ended before the closing quote was matched.`,
            suggestion: `Add a closing double quote (") at the end of the key.`
          });
        } else if (nextToken.isSingleQuoted) {
          this.errors.push({
            line: nextToken.line,
            column: nextToken.col,
            message: `Invalid quotes: Object keys must be double-quoted.`,
            severity: 'error',
            startIdx: nextToken.start,
            endIdx: nextToken.end,
            explanation: `Standard JSON requires all object keys to be double-quoted ("). Single quotes (') are not allowed.`,
            suggestion: `Replace the single quotes around the key with double quotes (e.g. 'key' -> "key").`
          });
        }

        if (keySet.has(nextToken.value)) {
          this.errors.push({
            line: nextToken.line,
            column: nextToken.col,
            message: `Duplicate key warning: Key '${nextToken.value}' is defined multiple times.`,
            severity: 'warning',
            startIdx: nextToken.start,
            endIdx: nextToken.end,
            explanation: `Defining duplicate keys in a JSON object is technically permitted, but standard JSON parsers will overwrite previous occurrences, which can lead to data loss or unexpected behavior.`,
            suggestion: `Consolidate or remove the duplicate key '${nextToken.value}'.`
          });
        } else {
          keySet.add(nextToken.value);
        }
      } else if (nextToken.type === 'invalid' && nextToken.isUnquoted) {
        this.advance();
        this.errors.push({
          line: nextToken.line,
          column: nextToken.col,
          message: `Invalid unquoted key: Key '${nextToken.value}' must be double-quoted.`,
          severity: 'error',
          startIdx: nextToken.start,
          endIdx: nextToken.end,
          explanation: `In standard JSON, all object keys must be enclosed in double quotes. Unquoted identifiers (like in Javascript objects) are invalid.`,
          suggestion: `Wrap the key in double quotes (e.g. "${nextToken.value}").`
        });
      } else {
        this.errors.push({
          line: nextToken.line,
          column: nextToken.col,
          message: `Expected an object key (double-quoted string) but found '${nextToken.value || 'EOF'}'.`,
          severity: 'error',
          startIdx: nextToken.start,
          endIdx: nextToken.end,
          explanation: `Objects must consist of key-value pairs where the key is always a double-quoted string.`,
          suggestion: `Insert a double-quoted string key before this position.`
        });
        if (nextToken.type !== 'eof' && nextToken.type !== 'brace-close' && nextToken.type !== 'comma') {
          this.advance();
        }
      }

      const colonToken = this.peek();
      if (this.match('colon')) {
        // Valid colon
      } else {
        this.errors.push({
          line: colonToken.line,
          column: colonToken.col,
          message: `Expected colon ':' after object key, but found '${colonToken.value || 'EOF'}'.`,
          severity: 'error',
          startIdx: colonToken.start,
          endIdx: colonToken.end,
          explanation: `Every key in a JSON object must be followed immediately by a colon (:) to separate it from its associated value.`,
          suggestion: `Add a colon ':' after the object key.`
        });
      }

      this.parseValue();

      const separatorToken = this.peek();
      if (this.match('comma')) {
        if (this.check('brace-close')) {
          const trailingCommaToken = this.previous();
          this.errors.push({
            line: trailingCommaToken.line,
            column: trailingCommaToken.col,
            message: `Trailing comma in object is invalid.`,
            severity: 'error',
            startIdx: trailingCommaToken.start,
            endIdx: trailingCommaToken.end,
            explanation: `Standard JSON does not permit trailing commas after the final member of an object.`,
            suggestion: `Remove the trailing comma before the closing brace '}'.`
          });
          this.advance();
          break;
        }
      } else if (this.match('brace-close')) {
        break;
      } else {
        if (this.isAtEnd()) {
          this.errors.push({
            line: openToken.line,
            column: openToken.col,
            message: `Unclosed object. Expected closing brace '}' to match open brace.`,
            severity: 'error',
            startIdx: openToken.start,
            endIdx: openToken.end,
            explanation: `Every opening curly brace '{' must have a matching closing curly brace '}'. The parser reached the end of the file without finding it.`,
            suggestion: `Add a closing brace '}' at the end of the object.`
          });
          break;
        } else if (
          this.peek().type === 'string' ||
          (this.peek().type === 'invalid' && this.peek().isUnquoted) ||
          this.peek().type === 'brace-open'
        ) {
          this.errors.push({
            line: separatorToken.line,
            column: separatorToken.col,
            message: `Missing comma between object members`,
            severity: 'error',
            startIdx: separatorToken.start,
            endIdx: separatorToken.end,
            expected: `", "`,
            received: `"${separatorToken.value}"`,
            reason: `JSON requires commas between properties.`,
            explanation: `Multiple elements in a JSON object must be separated by commas (,).`,
            suggestion: `Add a comma after this property.`
          });
        } else {
          this.errors.push({
            line: separatorToken.line,
            column: separatorToken.col,
            message: `Expected comma ',' or closing brace '}' but found '${separatorToken.value || 'EOF'}'.`,
            severity: 'error',
            startIdx: separatorToken.start,
            endIdx: separatorToken.end,
            explanation: `Members of a JSON object must be separated by a comma (,), or the object must be terminated by a closing brace (}).`,
            suggestion: `Insert a comma (,) or close the object with '}'.`
          });
          this.advance();
          if (this.isAtEnd() || this.check('brace-close')) {
            this.match('brace-close');
            break;
          }
        }
      }
    }
  }

  private parseArray(): void {
    const openToken = this.advance();

    if (this.match('bracket-close')) {
      return;
    }

    while (true) {
      this.parseValue();

      const separatorToken = this.peek();
      if (this.match('comma')) {
        if (this.check('bracket-close')) {
          const trailingCommaToken = this.previous();
          this.errors.push({
            line: trailingCommaToken.line,
            column: trailingCommaToken.col,
            message: `Trailing comma in array is invalid.`,
            severity: 'error',
            startIdx: trailingCommaToken.start,
            endIdx: trailingCommaToken.end,
            explanation: `Standard JSON does not permit trailing commas after the final element of an array.`,
            suggestion: `Remove the trailing comma before the closing bracket ']'.`
          });
          this.advance();
          break;
        }
      } else if (this.match('bracket-close')) {
        break;
      } else {
        if (this.isAtEnd()) {
          this.errors.push({
            line: openToken.line,
            column: openToken.col,
            message: `Unclosed array. Expected closing bracket ']' to match open bracket.`,
            severity: 'error',
            startIdx: openToken.start,
            endIdx: openToken.end,
            explanation: `Every opening square bracket '[' must have a matching closing square bracket ']'. The parser reached the end of the file without finding it.`,
            suggestion: `Add a closing bracket ']' at the end of the array.`
          });
          break;
        } else {
          const isValueStart = [
            'string',
            'number',
            'literal',
            'brace-open',
            'bracket-open'
          ].includes(this.peek().type);

          if (isValueStart) {
            this.errors.push({
              line: separatorToken.line,
              column: separatorToken.col,
              message: `Missing comma between array elements.`,
              severity: 'error',
              startIdx: separatorToken.start,
              endIdx: separatorToken.end,
              explanation: `Array elements must be separated from one another by a comma (,).`,
              suggestion: `Insert a comma (,) before the next element.`
            });
          } else {
            this.errors.push({
              line: separatorToken.line,
              column: separatorToken.col,
              message: `Expected comma ',' or closing bracket ']' but found '${separatorToken.value || 'EOF'}'.`,
              severity: 'error',
              startIdx: separatorToken.start,
              endIdx: separatorToken.end,
              explanation: `Array elements must be separated by a comma (,), or the array must be terminated by a closing bracket (]).`,
              suggestion: `Insert a comma (,) or close the array with ']'.`
            });
            this.advance();
            if (this.isAtEnd() || this.check('bracket-close')) {
              this.match('bracket-close');
              break;
            }
          }
        }
      }
    }
  }
}

export const validateJSON = (text: string): ValidationError[] => {
  const trimmed = text.trim();
  if (!trimmed) {
    return [
      {
        line: 1,
        column: 1,
        message: 'JSON input is empty.',
        severity: 'error',
        explanation: 'There is no input content to validate.',
        suggestion: 'Paste a JSON structure or load a sample JSON to start.'
      }
    ];
  }

  try {
    const tokens = tokenize(text);
    const parser = new Parser(tokens);

    parser.parseValue();

    const remainingToken = parser.peek();
    if (remainingToken.type !== 'eof') {
      parser.errors.push({
        line: remainingToken.line,
        column: remainingToken.col,
        message: `Unexpected token '${remainingToken.value}' after top-level JSON value.`,
        severity: 'error',
        startIdx: remainingToken.start,
        endIdx: remainingToken.end,
        explanation: `Standard JSON documents can only contain a single root value (an object, array, string, number, or literal). Extra characters were found after the root value.`,
        suggestion: `Remove the trailing characters, or wrap all root-level items in a single parent array [ ... ] or object { ... }.`
      });
    }

    return parser.errors;
  } catch (e: any) {
    return [
      {
        line: 1,
        column: 1,
        message: `Validation failed: ${e.message || 'Unknown parsing error'}`,
        severity: 'error',
        explanation: `A fatal error occurred during lexical parsing.`,
        suggestion: `Ensure the document is structured properly and contains no corrupted character bytes.`
      }
    ];
  }
};

export const autoFixJSON = (text: string): { fixed: string; success: boolean; error?: string } => {
  const trimmed = text.trim();
  if (!trimmed) {
    return { fixed: '', success: false, error: 'JSON input is empty.' };
  }

  try {
    const tokens = tokenize(text);
    let output = '';
    let stack: ('{' | '[')[] = [];
    let expectingKey = false;
    let expectingColon = false;
    let expectingComma = false;

    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx];
      if (token.type === 'eof') break;

      const parent = stack[stack.length - 1];

      // Handle missing colons or commas before processing the token
      if (token.type !== 'brace-close' && token.type !== 'bracket-close') {
        if (expectingColon && token.type !== 'colon') {
          output += ':';
          expectingColon = false;
          expectingKey = false;
        } else if (expectingComma && token.type !== 'comma') {
          output += ',';
          expectingComma = false;
          if (parent === '{') {
            expectingKey = true;
          }
        }
      }

      if (token.type === 'brace-open') {
        stack.push('{');
        expectingKey = true;
        expectingColon = false;
        expectingComma = false;
        output += '{';
      } else if (token.type === 'bracket-open') {
        stack.push('[');
        expectingKey = false;
        expectingColon = false;
        expectingComma = false;
        output += '[';
      } else if (token.type === 'brace-close') {
        if (stack.length > 0 && stack[stack.length - 1] === '{') {
          stack.pop();
        }
        expectingKey = false;
        expectingColon = false;
        
        const newParent = stack[stack.length - 1];
        expectingComma = !!newParent;
        output += '}';
      } else if (token.type === 'bracket-close') {
        if (stack.length > 0 && stack[stack.length - 1] === '[') {
          stack.pop();
        }
        expectingKey = false;
        expectingColon = false;

        const newParent = stack[stack.length - 1];
        expectingComma = !!newParent;
        output += ']';
      } else if (token.type === 'comma') {
        // Look ahead for trailing comma
        const nextToken = tokens[idx + 1];
        if (
          nextToken &&
          (nextToken.type === 'brace-close' || nextToken.type === 'bracket-close' || nextToken.type === 'eof')
        ) {
          // Skip trailing comma
          if (parent === '{') {
            expectingKey = false;
          }
          expectingColon = false;
          expectingComma = false;
          continue;
        }
        output += ',';
        expectingColon = false;
        expectingComma = false;
        if (parent === '{') {
          expectingKey = true;
        }
      } else if (token.type === 'colon') {
        output += ':';
        expectingColon = false;
        expectingKey = false;
        expectingComma = false;
      } else if (token.type === 'string') {
        let val = token.value;
        if (token.isSingleQuoted) {
          // Unescape escaped single quotes: \' -> '
          let fixedVal = val.replace(/\\'/g, "'");
          // Escape unescaped double quotes: " -> \"
          fixedVal = fixedVal.split('\\"').map((part) => part.replace(/"/g, '\\"')).join('\\"');
          output += `"${fixedVal}"`;
        } else {
          output += `"${val}"`;
        }

        if (parent === '{' && expectingKey) {
          expectingColon = true;
          expectingKey = false;
          expectingComma = false;
        } else {
          expectingColon = false;
          expectingKey = false;
          expectingComma = !!parent;
        }
      } else if (token.type === 'number') {
        let val = token.value;
        if (/^\-?0\d+/.test(val)) {
          const isNegative = val.startsWith('-');
          const absVal = isNegative ? val.slice(1) : val;
          const fixedAbs = absVal.replace(/^0+/, '');
          val = (isNegative ? '-' : '') + (fixedAbs || '0');
        }
        output += val;
        expectingColon = false;
        expectingKey = false;
        expectingComma = !!parent;
      } else if (token.type === 'literal') {
        output += token.value;
        expectingColon = false;
        expectingKey = false;
        expectingComma = !!parent;
      } else if (token.type === 'invalid') {
        if (token.isUnquoted && parent === '{' && expectingKey) {
          output += `"${token.value}"`;
          expectingColon = true;
          expectingKey = false;
          expectingComma = false;
        } else if (token.isUnquoted && (token.value === 'undefined' || token.value === 'NaN')) {
          output += 'null';
          expectingColon = false;
          expectingKey = false;
          expectingComma = !!parent;
        } else {
          output += token.value;
          expectingColon = false;
          expectingKey = false;
          expectingComma = !!parent;
        }
      }
    }

    // Append missing closing brackets/braces
    while (stack.length > 0) {
      const open = stack.pop();
      if (open === '{') {
        output += '}';
      } else if (open === '[') {
        output += ']';
      }
    }

    // Attempt to format/validate the fixed output
    try {
      JSON.parse(output);
      return { fixed: output, success: true };
    } catch (e: any) {
      return { fixed: output, success: false, error: e.message || 'Auto-fixed JSON has formatting errors' };
    }
  } catch (e: any) {
    return { fixed: text, success: false, error: e.message || 'Failed to auto-fix JSON' };
  }
};
