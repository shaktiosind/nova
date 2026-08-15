export enum TokenType {
  // Literals
  NUMBER = "NUMBER",
  STRING = "STRING",
  BOOL = "BOOL",
  NULL = "NULL",

  // Identifiers & keywords
  IDENT = "IDENT",
  LET = "let",
  FN = "fn",
  IF = "if",
  ELIF = "elif",
  ELSE = "else",
  WHILE = "while",
  FOR = "for",
  IN = "in",
  RETURN = "return",
  BREAK = "break",
  CONTINUE = "continue",
  IMPORT = "import",
  FROM = "from",
  AS = "as",
  MATCH = "match",
  CASE = "case",
  TRY = "try",
  CATCH = "catch",
  THROW = "throw",
  CLASS = "class",
  NEW = "new",
  SELF = "self",
  PRINT = "print",

  // Operators
  PLUS = "+",
  MINUS = "-",
  STAR = "*",
  SLASH = "/",
  PERCENT = "%",
  STARSTAR = "**",
  EQ = "=",
  EQEQ = "==",
  BANGEQ = "!=",
  LT = "<",
  GT = ">",
  LTEQ = "<=",
  GTEQ = ">=",
  AND = "and",
  OR = "or",
  NOT = "not",
  PLUSEQ = "+=",
  MINUSEQ = "-=",
  STAREQ = "*=",
  SLASHEQ = "/=",
  ARROW = "->",
  FATARROW = "=>",
  PIPE = "|>",
  DOTDOT = "..",
  DOTDOTDOT = "...",

  // Delimiters
  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  LBRACKET = "[",
  RBRACKET = "]",
  COMMA = ",",
  DOT = ".",
  COLON = ":",
  SEMICOLON = ";",
  NEWLINE = "NEWLINE",
  INDENT = "INDENT",
  DEDENT = "DEDENT",

  EOF = "EOF",
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.LET,
  fn: TokenType.FN,
  if: TokenType.IF,
  elif: TokenType.ELIF,
  else: TokenType.ELSE,
  while: TokenType.WHILE,
  for: TokenType.FOR,
  in: TokenType.IN,
  return: TokenType.RETURN,
  break: TokenType.BREAK,
  continue: TokenType.CONTINUE,
  import: TokenType.IMPORT,
  from: TokenType.FROM,
  as: TokenType.AS,
  match: TokenType.MATCH,
  case: TokenType.CASE,
  try: TokenType.TRY,
  catch: TokenType.CATCH,
  throw: TokenType.THROW,
  class: TokenType.CLASS,
  new: TokenType.NEW,
  self: TokenType.SELF,
  print: TokenType.PRINT,
  true: TokenType.BOOL,
  false: TokenType.BOOL,
  null: TokenType.NULL,
  and: TokenType.AND,
  or: TokenType.OR,
  not: TokenType.NOT,
};

export class LexError extends Error {
  constructor(msg: string, public line: number, public col: number) {
    super(`[Lex Error] Line ${line}:${col} — ${msg}`);
  }
}

export class Lexer {
  private pos = 0;
  private line = 1;
  private col = 1;
  private tokens: Token[] = [];
  private indentStack: number[] = [0];
  private groupDepth = 0;
  private sawTabIndent = false;
  private sawSpaceIndent = false;

  constructor(private src: string) {}

  private peek(offset = 0): string {
    return this.src[this.pos + offset] ?? "";
  }

  private advance(): string {
    const ch = this.src[this.pos++];
    if (ch === "\n") { this.line++; this.col = 1; }
    else this.col++;
    return ch;
  }

  private match(ch: string): boolean {
    if (this.peek() === ch) { this.advance(); return true; }
    return false;
  }

  private addToken(type: TokenType, value: string, line = this.line, col = this.col): void {
    this.tokens.push({ type, value, line, col });
  }

  private skipLineComment(): void {
    while (this.peek() !== "\n" && this.peek() !== "") this.advance();
  }

  private readString(quote: string): string {
    let str = "";
    while (this.peek() !== quote && this.peek() !== "") {
      const ch = this.advance();
      if (ch === "\\") {
        const esc = this.advance();
        switch (esc) {
          case "n": str += "\n"; break;
          case "t": str += "\t"; break;
          case "r": str += "\r"; break;
          case "\\": str += "\\"; break;
          default: str += esc;
        }
      } else {
        str += ch;
      }
    }
    if (this.peek() === "") throw new LexError("Unterminated string", this.line, this.col);
    this.advance();
    return str;
  }

  private readNumber(): string {
    let num = "";
    while (/[\d_]/.test(this.peek())) num += this.advance();
    if (this.peek() === "." && /\d/.test(this.peek(1))) {
      num += this.advance();
      while (/\d/.test(this.peek())) num += this.advance();
    }
    if (this.peek() === "e" || this.peek() === "E") {
      num += this.advance();
      if (this.peek() === "+" || this.peek() === "-") num += this.advance();
      while (/\d/.test(this.peek())) num += this.advance();
    }
    return num.replace(/_/g, "");
  }

  private handleIndent(spaces: number, rawIndent = ""): void {
    if (rawIndent.includes("\t")) this.sawTabIndent = true;
    if (rawIndent.includes(" ")) this.sawSpaceIndent = true;
    if (this.sawTabIndent && this.sawSpaceIndent) {
      throw new LexError("Do not mix tabs and spaces for indentation. Use spaces only.", this.line, 1);
    }
    const current = this.indentStack[this.indentStack.length - 1];
    if (spaces > current) {
      this.indentStack.push(spaces);
      this.addToken(TokenType.INDENT, "INDENT");
    } else {
      while (this.indentStack.length > 1 && this.indentStack[this.indentStack.length - 1] > spaces) {
        this.indentStack.pop();
        this.addToken(TokenType.DEDENT, "DEDENT");
      }
      if (this.indentStack[this.indentStack.length - 1] !== spaces) {
        throw new LexError(`Inconsistent indentation (got ${spaces}, expected ${this.indentStack[this.indentStack.length - 1]})`, this.line, this.col);
      }
    }
  }

  tokenize(): Token[] {
    while (this.pos < this.src.length) {
      const startLine = this.line;
      const startCol = this.col;
      const ch = this.advance();

      if (ch === "\n") {
        if (this.groupDepth > 0) continue;

        let rawIndent = "";
        while (this.peek() === " " || this.peek() === "\t") rawIndent += this.advance();
        const spaces = [...rawIndent].reduce((n, c) => n + (c === "\t" ? 4 : 1), 0);
        const next = this.peek();
        if (next === "\n" || next === "#" || next === "") continue;

        this.addToken(TokenType.NEWLINE, "\\n", startLine, startCol);
        this.handleIndent(spaces, rawIndent);
        continue;
      }

      if (ch === " " || ch === "\t" || ch === "\r") continue;
      if (ch === "#") { this.skipLineComment(); continue; }

      if (ch === '"' || ch === "'") {
        const str = this.readString(ch);
        this.addToken(TokenType.STRING, str, startLine, startCol);
        continue;
      }

      if (/\d/.test(ch)) {
        this.pos--; this.col--;
        const num = this.readNumber();
        this.addToken(TokenType.NUMBER, num, startLine, startCol);
        continue;
      }

      if (/[a-zA-Z_]/.test(ch)) {
        let ident = ch;
        while (/[a-zA-Z0-9_]/.test(this.peek())) ident += this.advance();
        const kwType = KEYWORDS[ident];
        this.addToken(kwType ?? TokenType.IDENT, ident, startLine, startCol);
        continue;
      }

      switch (ch) {
        case "+": this.addToken(this.match("=") ? TokenType.PLUSEQ : TokenType.PLUS, ch, startLine, startCol); break;
        case "-": {
          if (this.match(">")) this.addToken(TokenType.ARROW, "->", startLine, startCol);
          else if (this.match("=")) this.addToken(TokenType.MINUSEQ, "-=", startLine, startCol);
          else this.addToken(TokenType.MINUS, "-", startLine, startCol);
          break;
        }
        case "*": {
          if (this.match("*")) this.addToken(TokenType.STARSTAR, "**", startLine, startCol);
          else if (this.match("=")) this.addToken(TokenType.STAREQ, "*=", startLine, startCol);
          else this.addToken(TokenType.STAR, "*", startLine, startCol);
          break;
        }
        case "/": {
          if (this.match("=")) this.addToken(TokenType.SLASHEQ, "/=", startLine, startCol);
          else this.addToken(TokenType.SLASH, "/", startLine, startCol);
          break;
        }
        case "%": this.addToken(TokenType.PERCENT, "%", startLine, startCol); break;
        case "=": {
          if (this.match("=")) this.addToken(TokenType.EQEQ, "==", startLine, startCol);
          else if (this.match(">")) this.addToken(TokenType.FATARROW, "=>", startLine, startCol);
          else this.addToken(TokenType.EQ, "=", startLine, startCol);
          break;
        }
        case "!": {
          if (this.match("=")) this.addToken(TokenType.BANGEQ, "!=", startLine, startCol);
          else throw new LexError("Unexpected '!'. Did you mean 'not'?", startLine, startCol);
          break;
        }
        case "<": { const isLteq = this.match("="); this.addToken(isLteq ? TokenType.LTEQ : TokenType.LT, isLteq ? "<=" : ch, startLine, startCol); break; }
        case ">": { const isGteq = this.match("="); this.addToken(isGteq ? TokenType.GTEQ : TokenType.GT, isGteq ? ">=" : ch, startLine, startCol); break; }
        case "|": {
          if (this.match(">")) this.addToken(TokenType.PIPE, "|>", startLine, startCol);
          else throw new LexError("Unexpected '|'. Did you mean '|>'?", startLine, startCol);
          break;
        }
        case ".": {
          if (this.match(".")) {
            if (this.match(".")) this.addToken(TokenType.DOTDOTDOT, "...", startLine, startCol);
            else this.addToken(TokenType.DOTDOT, "..", startLine, startCol);
          } else this.addToken(TokenType.DOT, ".", startLine, startCol);
          break;
        }
        case "(": this.groupDepth++; this.addToken(TokenType.LPAREN, "(", startLine, startCol); break;
        case ")": if (this.groupDepth === 0) throw new LexError('Unexpected ")"', startLine, startCol); this.groupDepth--; this.addToken(TokenType.RPAREN, ")", startLine, startCol); break;
        case "{": this.groupDepth++; this.addToken(TokenType.LBRACE, "{", startLine, startCol); break;
        case "}": if (this.groupDepth === 0) throw new LexError('Unexpected "}"', startLine, startCol); this.groupDepth--; this.addToken(TokenType.RBRACE, "}", startLine, startCol); break;
        case "[": this.groupDepth++; this.addToken(TokenType.LBRACKET, "[", startLine, startCol); break;
        case "]": if (this.groupDepth === 0) throw new LexError('Unexpected "]"', startLine, startCol); this.groupDepth--; this.addToken(TokenType.RBRACKET, "]", startLine, startCol); break;
        case ",": this.addToken(TokenType.COMMA, ",", startLine, startCol); break;
        case ":": this.addToken(TokenType.COLON, ":", startLine, startCol); break;
        case ";": this.addToken(TokenType.SEMICOLON, ";", startLine, startCol); break;
        default: throw new LexError(`Unexpected character '${ch}'`, startLine, startCol);
      }
    }

    if (this.groupDepth > 0) throw new LexError("Unclosed delimiter", this.line, this.col);
    while (this.indentStack.length > 1) {
      this.indentStack.pop();
      this.addToken(TokenType.DEDENT, "DEDENT");
    }
    this.addToken(TokenType.EOF, "EOF", this.line, this.col);
    return this.tokens;
  }
}
