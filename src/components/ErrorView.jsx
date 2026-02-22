import { API_BASE } from "../services/apiService.js";

export function ErrorView({ error, onRetry }) {
  const message = error?.message || String(error);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <h2
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 22,
          fontWeight: 800,
          color: "#b91c1c",
          marginBottom: 12,
        }}
      >
        Error al analizar
      </h2>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          color: "#374151",
          maxWidth: 560,
          lineHeight: 1.6,
          marginBottom: 20,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 12,
          padding: 16,
          textAlign: "left",
          wordBreak: "break-word",
        }}
      >
        {message}
      </p>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#6b7280",
          marginBottom: 24,
        }}
      >
        API configurada: <strong>{API_BASE || "(ninguna — modo demo)"}</strong>
      </p>
      <button
        type="button"
        onClick={onRetry}
        style={{
          background: "#111827",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "12px 24px",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        ← Intentar de nuevo
      </button>
    </div>
  );
}
