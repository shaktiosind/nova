import { Lexer } from "./lexer";
import { Parser, ParseError } from "./parser";
import { Interpreter } from "./interpreter";
import * as fs from "fs";
import * as readline from "readline";

export function run(
  src: string,
  output?: (s: string) => void,
  interpreter?: Interpreter
): { ok: boolean; error?: string; output: string[] } {
  const lines: string[] = [];
  const interp = interpreter ?? new Interpreter();
  const previousOutput = interpreter ? interpreter.output : undefined;
  const emit = (s: string) => {
    lines.push(s);
    if (output) output(s);
    else previousOutput?.(s);
  };

  try {
    const tokens = new Lexer(src).tokenize();
    const ast = new Parser(tokens).parse();
    interp.output = emit;
    interp.run(ast);
    return { ok: true, output: lines };
  } catch (e: any) {
    return { ok: false, error: e.message ?? String(e), output: lines };
  }
}

function looksLikeContinuation(source: string): boolean {
  const lines = source.split(/\r?\n/);
  const last = lines[lines.length - 1]?.trim() ?? "";

  if (last.endsWith(":")) return true;

  let depth = 0;
  let quote = "";
  let escaped = false;
  for (const line of lines) {
    for (const ch of line) {
      if (escaped) { escaped = false; continue; }
      if (ch === "\\") { escaped = true; continue; }
      if (quote) {
        if (ch === quote) quote = "";
        continue;
      }
      if (ch === '"' || ch === "'") { quote = ch; continue; }
      if (ch === "(" || ch === "[" || ch === "{") depth++;
      else if (ch === ")" || ch === "]" || ch === "}") depth--;
    }
  }

  if (depth > 0 || quote) return true;
  return false;
}

function printHelp(): void {
  console.log(`Nova — beginner-friendly scripting

Commands:
  help                 Show this help
  examples             Show small Nova examples
  version              Show the Nova version
  check <file.nv>      Check a program without running it
  run <file.nv>        Run a Nova program explicitly
  exit                 Quit Nova

Examples:
  let x = 42
  print(x * 2)

  fn greet(name):
    print("Hello,", name)
  greet("Nova")

Tip: after a line ending with ':' Nova enters multi-line mode.
`);
}

function printExamples(): void {
  console.log(`Example 1 — variables
  let name = "Nova"
  let age = 20
  print(name, age)

Example 2 — function
  fn add(a, b):
    return a + b
  print(add(2, 3))

Example 3 — list pipeline
  let nums = [1, 2, 3, 4, 5]
  print(nums.filter(fn(x) => x % 2 == 0).map(fn(x) => x * 10))
`);
}

async function repl(): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const interp = new Interpreter();
  interp.output = (s) => console.log(s);

  console.log("Nova 1.1 — simple syntax, helpful errors");
  console.log("Type 'help' for help, 'examples' for examples, 'exit' to quit.");
  console.log("─".repeat(62));

  let buffer: string[] = [];
  let continuation = false;

  const execute = (source: string) => {
    const result = run(source, undefined, interp);
    if (!result.ok) console.error(`\x1b[31m${result.error}\x1b[0m`);
  };

  const prompt = () => {
    rl.question(continuation ? "... " : ">>> ", (line: string) => {
      const trimmed = line.trim();
      if (!continuation && trimmed === "exit") { rl.close(); return; }
      if (!continuation && trimmed === "help") { printHelp(); return prompt(); }
      if (!continuation && trimmed === "examples") { printExamples(); return prompt(); }
      if (!trimmed) {
        if (buffer.length > 0) { execute(buffer.join("\n")); buffer = []; continuation = false; }
        return prompt();
      }
      if (buffer.length > 0 && continuation) {
        buffer.push(line);
        const source = buffer.join("\n");
        if (!looksLikeContinuation(source) && !source.split(/\r?\n/).some(l => l.trimEnd().endsWith(":"))) {
          execute(source); buffer = []; continuation = false;
        }
        return prompt();
      }
      buffer.push(line);
      const source = buffer.join("\n");
      continuation = looksLikeContinuation(source);
      if (!continuation) { execute(source); buffer = []; }
      prompt();
    });
  };
  prompt();
}

function runFile(path: string): void {
  const src = fs.readFileSync(path, "utf8");
  const result = run(src, console.log);
  if (!result.ok) { console.error(result.error); process.exitCode = 1; }
}

function checkFile(path: string): void {
  try {
    const src = fs.readFileSync(path, "utf8");
    new Parser(new Lexer(src).tokenize()).parse();
    console.log(`✓ ${path} looks valid.`);
  } catch (e: any) {
    console.error(e.message ?? String(e));
    process.exitCode = 1;
  }
}

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === "repl") repl();
else if (args[0] === "help" || args[0] === "--help" || args[0] === "-h") printHelp();
else if (args[0] === "examples") printExamples();
else if (args[0] === "version" || args[0] === "--version" || args[0] === "-v") console.log("Nova 1.1.0");
else if (args[0] === "check") {
  if (!args[1]) { console.error("Usage: nova check <file.nv>"); process.exitCode = 1; }
  else checkFile(args[1]);
} else if (args[0] === "run") {
  if (!args[1]) { console.error("Usage: nova run <file.nv>"); process.exitCode = 1; }
  else runFile(args[1]);
} else runFile(args[0]);
