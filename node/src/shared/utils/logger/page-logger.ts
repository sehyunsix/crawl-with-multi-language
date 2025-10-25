// logger/page-logger.ts
import type { Page, HTTPRequest, ConsoleMessage, Dialog } from "puppeteer";

type PageLoggerOptions = {
  prefix?: string; // 로그 프리픽스
  logConsole?: boolean; // 페이지 console.* 로그
  logRequests?: boolean; // 네트워크 요청 시작
  logResponses?: boolean; // 네트워크 응답/완료
  logFailures?: boolean; // 요청 실패
  logErrors?: boolean; // pageerror/error
  logNavigation?: boolean; // DOMContentLoaded/load/navigated
  logDialogs?: boolean; // alert/confirm/prompt
  logger?: (line: string) => void; // 커스텀 출력 (기본: console.log)
};

const defaults: Required<Omit<PageLoggerOptions, "prefix" | "logger">> = {
  logConsole: true,
  logRequests: true,
  logResponses: true,
  logFailures: true,
  logErrors: true,
  logNavigation: true,
  logDialogs: true,
};

export function attachPageLogger(page: Page, opts: PageLoggerOptions = {}) {
  const { prefix = "[page]", logger = (s) => console.log(s), ...rest } = opts;

  const cfg = { ...defaults, ...rest };
  const startedAt = new WeakMap<HTTPRequest, number>();

  const p = (msg: string) => logger(`${prefix} ${msg}`);

  // --- handlers ---
  const onConsole = (msg: ConsoleMessage) => {
    // ex) [page] console.warn @/foo:12:34  Message text
    const loc = msg.location();
    p(
      `console.${msg.type()} @${loc?.url ?? ""}${loc?.lineNumber != null ? ":" + loc.lineNumber : ""}${loc?.columnNumber != null ? ":" + loc.columnNumber : ""}  ${msg.text()}`,
    );
  };

  const onRequest = (req: HTTPRequest) => {
    startedAt.set(req, Date.now());
    p(`➡️  ${req.method()} ${req.url()}`);
  };

  const onRequestFinished = (req: HTTPRequest) => {
    const t0 = startedAt.get(req) ?? Date.now();
    const dt = Date.now() - t0;
    const res = req.response();
    const status = res ? `${res.status()} ${res.statusText()}` : "(no response)";
    p(`✅ ${req.method()} ${req.url()}  ${status}  ${dt}ms`);
  };

  const onRequestFailed = (req: HTTPRequest) => {
    const t0 = startedAt.get(req) ?? Date.now();
    const dt = Date.now() - t0;
    p(`❌ ${req.method()} ${req.url()}  failed: ${req.failure()?.errorText}  ${dt}ms`);
  };

  const onPageError = (err: Error) => {
    p(`🔥 pageerror: ${err.name}: ${err.message}\n${err.stack ?? ""}`);
  };

  const onError = (err: Error) => {
    p(`💥 error: ${err.name}: ${err.message}`);
  };

  const onDOMContentLoaded = () => p("📄 DOMContentLoaded");
  const onLoad = () => p("📦 load");
  const onFrameNavigated = () => p(`🔀 navigated -> ${page.url()}`);

  const onDialog = (d: Dialog) => {
    p(`💬 dialog[${d.type()}]: ${d.message()}`);
  };

  // --- attach ---
  if (cfg.logConsole) page.on("console", onConsole);
  if (cfg.logRequests) page.on("request", onRequest);
  if (cfg.logResponses) page.on("requestfinished", onRequestFinished);
  if (cfg.logFailures) page.on("requestfailed", onRequestFailed);
  if (cfg.logErrors) {
    page.on("pageerror", onPageError);
    page.on("error", onError);
  }
  if (cfg.logNavigation) {
    page.on("domcontentloaded", onDOMContentLoaded);
    page.on("load", onLoad);
    page.on("framenavigated", onFrameNavigated);
  }
  if (cfg.logDialogs) page.on("dialog", onDialog);

  // --- disposer ---
  const dispose = () => {
    if (cfg.logConsole) page.off("console", onConsole);
    if (cfg.logRequests) page.off("request", onRequest);
    if (cfg.logResponses) page.off("requestfinished", onRequestFinished);
    if (cfg.logFailures) page.off("requestfailed", onRequestFailed);
    if (cfg.logErrors) {
      page.off("pageerror", onPageError);
      page.off("error", onError);
    }
    if (cfg.logNavigation) {
      page.off("domcontentloaded", onDOMContentLoaded);
      page.off("load", onLoad);
      page.off("framenavigated", onFrameNavigated);
    }
    if (cfg.logDialogs) page.off("dialog", onDialog);
  };

  return { dispose };
}
