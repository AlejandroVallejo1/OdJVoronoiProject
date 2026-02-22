/**
 * Logger que además de consola envía mensajes a la UI (evento nutriscan-ui-log).
 * La app escucha y los muestra en un panel.
 */
const EVENT_NAME = "nutriscan-ui-log";

function formatArg(a) {
  if (a == null) return String(a);
  if (typeof a === "object") return JSON.stringify(a);
  return String(a);
}

function push(level, args) {
  const message = args.map(formatArg).join(" ");
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, {
        detail: { level, message, time: new Date().toLocaleTimeString() },
      })
    );
  }
}

export const uiLogger = {
  log(...args) {
    push("log", args);
  },
  warn(...args) {
    push("warn", args);
  },
  error(...args) {
    push("error", args);
  },
  EVENT_NAME,
};
