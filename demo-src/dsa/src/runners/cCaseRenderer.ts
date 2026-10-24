import type { CParam, CReturn, CSignature } from "./cTypes";

/**
 * Generic C case-body + starter-code generator, driven entirely by a
 * problem's declarative `cSignature` (see cTypes.ts) plus its ordinary JS
 * `testCases`. Replaces writing a bespoke render function per problem (as
 * the original Two Sum pilot did) with one shared renderer that works for
 * any problem whose signature fits the modeled shapes.
 */

function escapeCString(s: string): string {
  let out = "";
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    if (ch === "\\") out += "\\\\";
    else if (ch === '"') out += '\\"';
    else if (ch === "\n") out += "\\n";
    else if (ch === "\t") out += "\\t";
    else if (code < 0x20) out += "\\x" + code.toString(16).padStart(2, "0");
    else out += ch;
  }
  return out;
}

function expectNumberArray(value: unknown, label: string): number[] {
  if (!Array.isArray(value) || !value.every((v) => typeof v === "number")) {
    throw new Error(`Expected a number[] for ${label}, got ${JSON.stringify(value)}`);
  }
  return value as number[];
}

function expectStringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) {
    throw new Error(`Expected a string[] for ${label}, got ${JSON.stringify(value)}`);
  }
  return value as string[];
}

function expectNumberMatrix(value: unknown, cols: number, label: string): number[][] {
  if (!Array.isArray(value) || !value.every((row) => Array.isArray(row) && row.length === cols)) {
    throw new Error(`Expected an N x ${cols} number[][] for ${label}, got ${JSON.stringify(value)}`);
  }
  return value as number[][];
}

function renderParamDecl(param: CParam, value: unknown): string {
  switch (param.kind) {
    case "int": {
      if (typeof value !== "number") throw new Error(`Expected a number for ${param.name}`);
      return `int ${param.name} = ${Math.trunc(value)};`;
    }
    case "bool":
      return `bool ${param.name} = ${value ? "true" : "false"};`;
    case "string": {
      if (typeof value !== "string") throw new Error(`Expected a string for ${param.name}`);
      return `char ${param.name}[] = "${escapeCString(value)}";`;
    }
    case "intArray": {
      const nums = expectNumberArray(value, param.name);
      if (nums.length === 0) return `int ${param.name}[1]; int ${param.sizeName} = 0;`;
      return `int ${param.name}[] = {${nums.map((n) => Math.trunc(n)).join(", ")}}; int ${param.sizeName} = ${nums.length};`;
    }
    case "stringArray": {
      const strs = expectStringArray(value, param.name);
      if (strs.length === 0) return `char* ${param.name}[1]; int ${param.sizeName} = 0;`;
      const items = strs.map((s) => `"${escapeCString(s)}"`).join(", ");
      return `char* ${param.name}[] = {${items}}; int ${param.sizeName} = ${strs.length};`;
    }
    case "intMatrix": {
      const rows = expectNumberMatrix(value, param.cols, param.name);
      if (rows.length === 0) return `int ${param.name}[1][${param.cols}]; int ${param.sizeName} = 0;`;
      const body = rows.map((row) => `{${row.map((n) => Math.trunc(n)).join(", ")}}`).join(", ");
      return `int ${param.name}[][${param.cols}] = {${body}}; int ${param.sizeName} = ${rows.length};`;
    }
  }
}

function paramArgNames(param: CParam): string[] {
  switch (param.kind) {
    case "int":
    case "bool":
    case "string":
      return [param.name];
    case "intArray":
    case "stringArray":
    case "intMatrix":
      return [param.name, param.sizeName];
  }
}

export function renderCCaseBody(fnName: string, csig: CSignature, input: unknown[]): string {
  if (input.length !== csig.params.length) {
    throw new Error(`${fnName}: expected ${csig.params.length} argument(s), got ${input.length}`);
  }

  const decls = csig.params.map((p, i) => renderParamDecl(p, input[i]));
  const args = csig.params.flatMap(paramArgNames);

  let call: string;
  let print: string;
  switch (csig.returns.kind) {
    case "int":
      call = `int __result = ${fnName}(${args.join(", ")});`;
      print = `printf("%d\\n", __result);`;
      break;
    case "bool":
      call = `bool __result = ${fnName}(${args.join(", ")});`;
      print = `printf(__result ? "true" : "false"); putchar('\\n');`;
      break;
    case "string":
      call = `char* __result = ${fnName}(${args.join(", ")});`;
      print = `__print_json_string(__result); putchar('\\n');`;
      break;
    case "intArray":
      call =
        `int __returnSize = 0;\n` +
        `int* __result = ${fnName}(${[...args, "&__returnSize"].join(", ")});`;
      print = `__print_json_int_array(__result, __returnSize); putchar('\\n');`;
      break;
    case "stringArray":
      call =
        `int __returnSize = 0;\n` +
        `char** __result = ${fnName}(${[...args, "&__returnSize"].join(", ")});`;
      print = `__print_json_string_array(__result, __returnSize); putchar('\\n');`;
      break;
  }

  return [...decls, call, print].join("\n");
}

function cParamTypeDecl(p: CParam): string {
  switch (p.kind) {
    case "int":
      return `int ${p.name}`;
    case "bool":
      return `bool ${p.name}`;
    case "string":
      return `char* ${p.name}`;
    case "intArray":
      return `int* ${p.name}, int ${p.sizeName}`;
    case "stringArray":
      return `char** ${p.name}, int ${p.sizeName}`;
    case "intMatrix":
      return `int ${p.name}[][${p.cols}], int ${p.sizeName}`;
  }
}

function cReturnTypeDecl(r: CReturn): string {
  switch (r.kind) {
    case "int":
      return "int";
    case "bool":
      return "bool";
    case "string":
      return "char*";
    case "intArray":
      return "int*";
    case "stringArray":
      return "char**";
  }
}

/** Generates the starter function stub shown in the editor when C is selected. */
export function renderCStarterCode(fnName: string, csig: CSignature): string {
  const paramDecls = csig.params.map(cParamTypeDecl).join(", ");
  const isArrayReturn = csig.returns.kind === "intArray" || csig.returns.kind === "stringArray";
  const fullParams = isArrayReturn ? `${paramDecls}, int* returnSize` : paramDecls;
  const hint = isArrayReturn
    ? "  // malloc your result array (the harness does not free it) and set *returnSize\n"
    : "";
  return `${cReturnTypeDecl(csig.returns)} ${fnName}(${fullParams}) {\n${hint}  // your code here\n}`;
}
