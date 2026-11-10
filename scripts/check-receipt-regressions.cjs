/* eslint-disable @typescript-eslint/no-require-imports */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const ts = require("typescript");

const repoRoot = path.resolve(__dirname, "..");
const originalLoad = Module._load;
const originalResolve = Module._resolveFilename;
const originalWindow = global.window;
let hooks;
let analyze;
let workerFixture;
let pdfText = "";
const timers = new Map();
let nextTimer = 0;

// Render the actual component's element tree with deterministic hook state and
// a manual progress clock. Browser rendering is checked separately; no handler
// source is copied into this test.
const react = {
  Fragment: Symbol.for("react.fragment"),
  useState(initial) {
    const owner = hooks;
    const slot = hooks.slot(() => ({ value: typeof initial === "function" ? initial() : initial }));
    return [slot.value, (next) => { owner.writes += 1; slot.value = typeof next === "function" ? next(slot.value) : next; }];
  },
  useRef(initial) { return hooks.slot(() => ({ current: initial })); },
  useMemo(factory, deps) { return hooks.memo(factory, deps); },
  useCallback(callback, deps) { return hooks.memo(() => callback, deps); },
  useEffect(effect, deps) {
    const slot = hooks.slot(() => ({}));
    if (!slot.deps || deps.some((value, index) => !Object.is(value, slot.deps[index]))) {
      hooks.effects.push(() => { slot.cleanup?.(); slot.cleanup = effect(); });
      slot.deps = deps;
    }
  },
};
const jsx = (type, props) => ({ type, props: props || {} });
const icons = new Proxy({}, { get: (_target, name) => name === "__esModule" ? true : () => null });

Module._resolveFilename = function resolveAlias(request, parent, ...args) {
  return originalResolve.call(this, request.startsWith("@/") ? path.join(repoRoot, "src", request.slice(2)) : request, parent, ...args);
};
Module._load = function loadFixture(request, parent, ...args) {
  if (request === "react") return react;
  if (request === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: react.Fragment };
  if (request === "next/image") return () => null;
  if (request === "lucide-react") return icons;
  if (request === "@/lib/analysis/analyzer") return { getEvidenceTypeFromFile: () => "receipt", analyzeEvidenceFile: (file) => analyze(file) };
  if (request === "@/lib/analysis/report-adapter") return {
    mapLocalAnalysisToReport: (result) => ({ ...require("../src/lib/claim-data.ts").mockAnalysisReports.receipt, reviewLabel: result.syntheticLabel }),
  };
  if (request === "@/lib/analysis/pdf-preview") return { renderPdfFirstPagePreview: async () => ({ objectUrl: "blob:synthetic-preview" }) };
  if (request === "tesseract.js") return { recognize: async (image, language, options) => {
    // v7's convenience function requests text only and terminates its worker.
    workerFixture.creation = [language, 1, options];
    workerFixture.recognition = { image, output: { text: true } };
    workerFixture.terminations += 1;
    return { data: { ...workerFixture.result.data, blocks: null } };
  }, createWorker: async (...options) => {
    workerFixture.creation = options;
    if (workerFixture.createError) throw workerFixture.createError;
    return {
      recognize: async (image, recognitionOptions, output) => {
        workerFixture.recognition = { image, recognitionOptions, output };
        if (workerFixture.error) throw workerFixture.error;
        return workerFixture.result;
      },
      terminate: async () => { workerFixture.terminations += 1; },
    };
  } };
  if (request === "pdfjs-dist/legacy/build/pdf.mjs") return {
    GlobalWorkerOptions: {},
    getDocument: () => ({ promise: Promise.resolve({ numPages: 2, getPage: async () => ({
      getTextContent: async () => ({ items: pdfText ? [{ str: pdfText, transform: [1, 0, 0, 1, 0, 0] }] : [] }),
      getViewport: () => ({ width: 100, height: 100 }), render: () => ({ promise: Promise.resolve() }),
    }) }) }),
  };
  return originalLoad.call(this, request, parent, ...args);
};
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8").replace(/import\.meta\.url/g, JSON.stringify(pathToFileURL(filename).href));
    const { outputText } = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: { esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    module._compile(outputText, filename);
  };
}
global.window = {
  setInterval(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
  clearInterval(id) { timers.delete(id); },
  document: { createElement: () => ({ getContext: () => ({}) }) },
};

const { ClaimReviewWorkflow } = require("../src/components/ClaimReviewWorkflow.tsx");
const { extractOcr } = require("../src/lib/analysis/ocr-service.ts");

function renderer() {
  const state = {
    slots: [], index: 0, effects: [], tree: null, writes: 0,
    slot(create) { const index = this.index++; return this.slots[index] ??= create(); },
    memo(factory, deps) {
      const slot = this.slot(() => ({}));
      if (!slot.deps || deps.some((value, index) => !Object.is(value, slot.deps[index]))) { slot.value = factory(); slot.deps = deps; }
      return slot.value;
    },
    render() { hooks = state; state.index = 0; state.tree = ClaimReviewWorkflow(); for (const effect of state.effects.splice(0)) effect(); return state.tree; },
    unmount() { for (const slot of this.slots) slot.cleanup?.(); },
  };
  state.render();
  return state;
}
function find(tree, predicate) {
  if (Array.isArray(tree)) return tree.map((child) => find(child, predicate)).find(Boolean);
  if (!tree || typeof tree !== "object") return null;
  return predicate(tree) ? tree : find(tree.props.children, predicate);
}
function text(tree) {
  if (Array.isArray(tree)) return tree.map(text).join("");
  return tree && typeof tree === "object" ? text(tree.props.children) : String(tree ?? "");
}
function button(ui, label) {
  const result = find(ui.tree, (node) => node.type === "button" && text(node) === label);
  assert.ok(result, `Missing button: ${label}`);
  return result.props.onClick;
}
function upload(ui, file) {
  const target = find(ui.tree, (node) => typeof node.props.onDrop === "function");
  target.props.onDrop({ preventDefault() {}, stopPropagation() {}, dataTransfer: { files: { item: () => file } } });
  ui.render();
}
function deferred() { let resolve; let reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
function result(label) {
  return {
    syntheticLabel: label, receipt: { sourceClassification: {}, structure: {}, missingFields: [] },
    ocr: { quality: {} }, metadata: { context: {}, metadataNotes: [] },
    verificationStatus: {}, scoreBreakdown: {}, imageHeuristics: {},
  };
}
const fileA = new File(["synthetic"], "synthetic-receipt-A.png", { type: "image/png" });
const fileB = new File(["synthetic"], "synthetic-receipt-B.png", { type: "image/png" });

async function checkWorkflow() {
  for (const outcome of ["success", "failure"]) {
    for (const action of ["reset", "replace", "unmount"]) {
      const pending = deferred();
      analyze = () => pending.promise;
      const ui = renderer();
      upload(ui, fileA);
      const run = button(ui, "Run Local Analysis")();
      ui.render();
      assert.equal(ui.tree.props["data-status"], "analyzing");
      const staleTick = [...timers.values()][0];
      if (action === "replace") upload(ui, fileB);
      else if (action === "reset") { button(ui, "Analyze Another File")(); ui.render(); }
      else ui.unmount();
      assert.equal(timers.size, 0, `${action} must stop the old progress timer`);
      const before = text(ui.tree);
      const beforeWrites = ui.writes;
      staleTick();
      if (outcome === "success") pending.resolve(result("stale synthetic result"));
      else pending.reject(new Error("synthetic stale failure"));
      await run;
      assert.equal(ui.writes, beforeWrites, `Stale ${outcome} must not publish after ${action}`);
      if (action !== "unmount") {
        ui.render();
        assert.equal(text(ui.tree), before, `Stale ${outcome} must not replace ${action} state`);
        assert.equal(ui.tree.props["data-status"], action === "reset" ? "idle" : "uploaded");
        ui.unmount();
      }
    }
  }
  const pendingA = deferred();
  const pendingB = deferred();
  analyze = (file) => file === fileA ? pendingA.promise : pendingB.promise;
  const ui = renderer();
  upload(ui, fileA);
  const runA = button(ui, "Run Local Analysis")();
  ui.render();
  upload(ui, fileB);
  const runB = button(ui, "Run Local Analysis")();
  ui.render();
  pendingA.resolve(result("old synthetic result"));
  await runA;
  assert.equal(timers.size, 1, "Old completion must not stop the new run's timer");
  pendingB.resolve(result("current synthetic result"));
  await runB;
  ui.render();
  assert.equal(ui.tree.props["data-status"], "complete");
  assert.ok(text(ui.tree).includes("current synthetic result"));
  assert.ok(!text(ui.tree).includes("old synthetic result"));
  assert.equal(timers.size, 0);
  ui.unmount();
  const failed = deferred();
  analyze = () => failed.promise;
  const retryUi = renderer();
  upload(retryUi, fileA);
  const failedRun = button(retryUi, "Run Local Analysis")();
  const originalError = console.error;
  let errorCount = 0;
  console.error = () => { errorCount += 1; };
  try { failed.reject(new Error("synthetic current failure")); await failedRun; }
  finally { console.error = originalError; }
  retryUi.render();
  assert.equal(errorCount, 1);
  assert.equal(retryUi.tree.props["data-status"], "uploaded");
  assert.ok(text(retryUi.tree).includes("Local analysis could not complete."));
  analyze = async () => result("synthetic retry result");
  await button(retryUi, "Run Local Analysis")();
  retryUi.render();
  assert.equal(retryUi.tree.props["data-status"], "complete");
  assert.ok(text(retryUi.tree).includes("synthetic retry result"));
  assert.equal(timers.size, 0);
  retryUi.unmount();
  console.log("Receipt workflow regressions passed (stale success/failure, reset, replacement, unmount and overlapping runs).");
}

async function checkOcr() {
  const words = Array.from({ length: 30 }, (_, index) => ({ text: index === 0 ? "$123.45" : `synthetic${index}`, confidence: index < 7 ? 30 : 98 }));
  const page = { text: words.map((word) => word.text).join(" "), confidence: 82, blocks: [
    { paragraphs: [{ lines: [{ words: words.slice(0, 5) }, { words: words.slice(5, 10) }] }] },
    { paragraphs: [{ lines: [{ words: words.slice(10) }] }] },
  ] };
  for (const file of [fileA, new File(["synthetic PDF"], "synthetic-receipt.pdf", { type: "application/pdf" })]) {
    workerFixture = { result: { data: page }, terminations: 0 };
    const ocr = await extractOcr(file);
    assert.equal(workerFixture.creation[0], "eng");
    assert.equal(ocr.quality.wordCount, 30);
    assert.equal(ocr.quality.lowConfidenceWordCount, 7);
    assert.equal(ocr.quality.lowConfidenceRate, 0.23);
    assert.equal(ocr.quality.label, "Usable");
    assert.equal(ocr.lowConfidenceRegions.length, 7);
    assert.ok(ocr.uncertaintyNotes.some((note) => note.label === "Very low-confidence OCR tokens"));
    assert.ok(ocr.uncertaintyNotes.some((note) => note.label === "Possible parsed-field impact"));
    assert.deepEqual(workerFixture.recognition.output, { text: true, blocks: true });
    assert.equal(workerFixture.terminations, 1);
  }
  workerFixture = { result: { data: { text: "", confidence: 0, blocks: null } }, terminations: 0 };
  assert.equal((await extractOcr(fileA)).quality.label, "Unreadable");
  assert.equal(workerFixture.terminations, 1);
  workerFixture = { error: new Error("synthetic recognition failure"), terminations: 0 };
  await assert.rejects(extractOcr(fileA), /synthetic recognition failure/);
  assert.equal(workerFixture.terminations, 1, "Recognition failure must terminate its worker");
  workerFixture = { createError: new Error("synthetic initialization failure"), terminations: 0 };
  await assert.rejects(extractOcr(fileA), /synthetic initialization failure/);
  workerFixture = { terminations: 0 };
  pdfText = "Synthetic merchant receipt with a complete readable text layer and no OCR requirement.";
  assert.equal((await extractOcr(new File(["PDF"], "synthetic.pdf", { type: "application/pdf" }))).engine, "pdfjs-text");
  assert.equal(workerFixture.creation, undefined, "Text PDFs must not create an OCR worker");
  console.log("OCR regressions passed (nested v7 words, uncertainty, image/rendered PDF, empty output and worker cleanup).");
}

(async () => {
  try { await checkWorkflow(); await checkOcr(); }
  finally { Module._load = originalLoad; Module._resolveFilename = originalResolve; global.window = originalWindow; }
})().catch((error) => { console.error(error); process.exitCode = 1; });
