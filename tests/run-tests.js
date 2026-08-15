const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const nova = path.resolve(__dirname, "..", "dist", "main.js");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "nova-tests-"));

function run(source) {
  const file = path.join(temp, "test.nv");
  fs.writeFileSync(file, source);
  const result = spawnSync(process.execPath, [nova, file], { encoding: "utf8" });
  return {
    ok: result.status === 0,
    output: result.stdout.trim(),
    error: result.stderr.trim(),
  };
}

function expectOutput(name, source, expected) {
  const result = run(source);
  assert.strictEqual(result.ok, true, `${name}: ${result.error}`);
  assert.strictEqual(result.output, expected, `${name}: output mismatch`);
  console.log(`✓ ${name}`);
}

function expectError(name, source, text) {
  const result = run(source);
  assert.strictEqual(result.ok, false, `${name}: expected an error`);
  assert.ok(
    (result.error || "").includes(text),
    `${name}: expected error to contain "${text}", got "${result.error}"`
  );
  console.log(`✓ ${name}`);
}

expectOutput("hello", `print("Hello")`, "Hello");
expectOutput("variables", `let x = 10\nx += 5\nprint(x)`, "15");
expectOutput("function", `fn add(a, b):\n  return a + b\nprint(add(2, 3))`, "5");
expectOutput("expression function", `fn add(a, b) => a + b\nprint(add(2, 3))`, "5");
expectOutput("closure", `fn counter():\n  let n = 0\n  fn next():\n    n += 1\n    return n\n  return next\nlet c = counter()\nprint(c())\nprint(c())`, "1\n2");
expectOutput("match guard", `fn classify(n):\n  match n:\n    case x if x < 0:\n      return "negative"\n    case 0:\n      return "zero"\n    case x:\n      return "positive"\nprint(classify(-1))\nprint(classify(0))\nprint(classify(2))`, "negative\nzero\npositive");
expectOutput("map pattern", `let p = {"name": "Alice", "age": 30}\nmatch p:\n  case {"name": name, "age": age}:\n    print(name, age)`, "Alice 30");
expectOutput("or pattern", `let x = 2\nmatch x:\n  case 1 or 2:\n    print("matched")\n  case _:\n    print("no")`, "matched");
expectOutput("pipeline", `let nums = [1, 2, 3, 4]\nprint(nums.filter(fn(x) => x % 2 == 0).map(fn(x) => x * 10))`, "[20, 40]");
expectOutput("descending range", `print(range(5, 0, -1))`, "[5, 4, 3, 2, 1]");
expectOutput("multiline list", `let values = [\n  1,\n  2,\n  3\n]\nprint(values)`, "[1, 2, 3]");
expectOutput("map equality", `print({"a": 1} == {"a": 1})\nprint({"a": 1} == {"a": 2})`, "true\nfalse");
expectError("zero range step", `print(range(1, 5, 0))`, "step cannot be 0");
expectError("missing argument", `fn add(a, b):\n  return a + b\nprint(add(1))`, "Missing required argument 'b'");
expectError("type error", `print(1 - "x")`, "requires a number");
expectError("undefined variable", `let name = "Nova"\nprint(nam)`, "Did you mean");
expectError("bad indentation", `if true:\n  print("x")\n print("bad")`, "Inconsistent indentation");
expectError("unclosed delimiter", `let x = [1, 2`, "Unclosed");

console.log("\nNova test suite passed.");
