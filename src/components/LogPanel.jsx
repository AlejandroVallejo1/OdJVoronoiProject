import { useState, useEffect } from "react";
import { uiLogger } from "../utils/uiLogger.js";

const MAX_LOGS = 80;

export function LogPanel() {
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handler = (e) => {
      const { level, message, time } = e.detail || {};
      setLogs((prev) => [...prev.slice(-(MAX_LOGS - 1)), { id: Date.now(), level, message, time }]);
    };
    window.addEventListener(uiLogger.EVENT_NAME, handler);
    return () => window.removeEventListener(uiLogger.EVENT_NAME, handler);
  }, []);

  const color = (level) => {
    if (level === "error") return "#ef4444";
    if (level === "warn") return "#f59e0b";
    return "#6b7280";
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: open ? 220 : 36,
        background: "#1f2937",
        borderTop: "1px solid #374151",
        zIndex: 9999,
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "8px 12px",
          background: "#111827",
          color: "#9ca3af",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontWeight: 700,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>📋 Logs ({logs.length})</span>
        <span>{open ? "▼" : "▲"}</span>
      </button>
      {open && (
        <>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {logs.length === 0 && (
              <div style={{ color: "#6b7280", padding: 8 }}>
                Los logs de apiService y App aparecerán aquí.
              </div>
            )}
            {logs.map(({ id, level, message, time }) => (
              <div
                key={id}
                style={{
                  color: color(level),
                  wordBreak: "break-all",
                  padding: "2px 4px",
                  borderLeft: `3px solid ${color(level)}`,
                  paddingLeft: 8,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <span style={{ color: "#6b7280", marginRight: 8 }}>[{time}]</span>
                {message}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLogs([])}
            style={{
              padding: "4px 12px",
              background: "#374151",
              color: "#9ca3af",
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              alignSelf: "flex-end",
              margin: "0 8px 8px 0",
              borderRadius: 4,
            }}
          >
            Limpiar
          </button>
        </>
      )}
    </div>
  );
}
