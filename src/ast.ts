// ─── Expression nodes ────────────────────────────────────────────────────────

export type Expr =
  | NumberLit
  | StringLit
  | BoolLit
  | NullLit
  | Ident
  | ListLit
  | MapLit
  | BinOp
  | UnaryOp
  | Assign
  | CompoundAssign
  | Call
  | Index
  | Member
  | Lambda
  | Pipe
  | Range
  | Spread
  | IfExpr
  | MatchExpr
  | NewExpr;

export interface NumberLit   { kind: "NumberLit";   value: number }
export interface StringLit   { kind: "StringLit";   value: string }
export interface BoolLit     { kind: "BoolLit";     value: boolean }
export interface NullLit     { kind: "NullLit" }
export interface Ident       { kind: "Ident";       name: string }
export interface Spread      { kind: "Spread";      expr: Expr }

export interface ListLit     { kind: "ListLit";     elements: Expr[] }
export interface MapLit      { kind: "MapLit";      entries: [Expr, Expr][] }

export interface BinOp       { kind: "BinOp";       op: string; left: Expr; right: Expr }
export interface UnaryOp     { kind: "UnaryOp";     op: string; operand: Expr }
export interface Assign      { kind: "Assign";      target: Expr; value: Expr }
export interface CompoundAssign { kind: "CompoundAssign"; op: string; target: Expr; value: Expr }

export interface Call        { kind: "Call";        callee: Expr; args: Expr[]; kwargs: [string, Expr][] }
export interface Index       { kind: "Index";       object: Expr; index: Expr }
export interface Member      { kind: "Member";      object: Expr; prop: string }
export interface NewExpr     { kind: "NewExpr";     className: string; args: Expr[] }

export interface Lambda      { kind: "Lambda";      params: Param[]; body: Expr | Stmt[] }
export interface Pipe        { kind: "Pipe";        left: Expr; right: Expr }
export interface Range       { kind: "Range";       start: Expr; end: Expr; inclusive: boolean }

export interface IfExpr      { kind: "IfExpr";      cond: Expr; then: Expr; else_: Expr }
export interface MatchExpr   {
  kind: "MatchExpr";
  subject: Expr;
  arms: MatchArm[];
}
export interface MatchArm    { pattern: Pattern; guard?: Expr; body: Expr | Stmt[] }

// ─── Pattern nodes ───────────────────────────────────────────────────────────

export type Pattern =
  | LiteralPattern
  | IdentPattern
  | ListPattern
  | MapPattern
  | WildcardPattern
  | OrPattern;

export interface LiteralPattern  { kind: "LiteralPattern";  value: number | string | boolean | null }
export interface IdentPattern    { kind: "IdentPattern";    name: string }
export interface WildcardPattern { kind: "WildcardPattern" }
export interface ListPattern     { kind: "ListPattern";     elements: Pattern[] }
export interface MapPattern      { kind: "MapPattern";      entries: [string, Pattern][] }
export interface OrPattern       { kind: "OrPattern";       patterns: Pattern[] }

// ─── Statement nodes ─────────────────────────────────────────────────────────

export type Stmt =
  | ExprStmt
  | LetStmt
  | FnDecl
  | ClassDecl
  | ReturnStmt
  | BreakStmt
  | ContinueStmt
  | IfStmt
  | WhileStmt
  | ForStmt
  | MatchStmt
  | TryCatch
  | ThrowStmt
  | ImportStmt
  | PrintStmt;

export interface ExprStmt    { kind: "ExprStmt";    expr: Expr }
export interface LetStmt     { kind: "LetStmt";     name: string; type?: string; value: Expr }
export interface ReturnStmt  { kind: "ReturnStmt";  value?: Expr }
export interface BreakStmt   { kind: "BreakStmt" }
export interface ContinueStmt { kind: "ContinueStmt" }
export interface ThrowStmt   { kind: "ThrowStmt";   value: Expr }
export interface PrintStmt   { kind: "PrintStmt";   args: Expr[] }

export interface Param {
  name: string;
  type?: string;
  default?: Expr;
  rest?: boolean;
}

export interface FnDecl {
  kind: "FnDecl";
  name: string;
  params: Param[];
  returnType?: string;
  body: Stmt[] | Expr;
}

export interface ClassDecl {
  kind: "ClassDecl";
  name: string;
  superclass?: string;
  methods: FnDecl[];
  fields: LetStmt[];
}

export interface IfStmt {
  kind: "IfStmt";
  cond: Expr;
  then: Stmt[];
  elif: { cond: Expr; body: Stmt[] }[];
  else_?: Stmt[];
}

export interface WhileStmt {
  kind: "WhileStmt";
  cond: Expr;
  body: Stmt[];
}

export interface ForStmt {
  kind: "ForStmt";
  name: string;
  iter: Expr;
  body: Stmt[];
}

export interface MatchStmt {
  kind: "MatchStmt";
  subject: Expr;
  arms: MatchArm[];
}

export interface TryCatch {
  kind: "TryCatch";
  body: Stmt[];
  catchName?: string;
  catch: Stmt[];
  finally_?: Stmt[];
}

export interface ImportStmt {
  kind: "ImportStmt";
  path: string;
  alias?: string;
  names?: string[];
}

export type Program = Stmt[];
