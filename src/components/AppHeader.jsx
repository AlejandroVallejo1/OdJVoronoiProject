import { API_BASE } from "../services/apiService.js";

export function AppHeader() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
        paddingBottom: 16,
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#111827",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🥗
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 18,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.1,
            }}
          >
            NutriScan
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Escanea · Compara · Come mejor
          </div>
        </div>
      </div>

      {!API_BASE && (
        <span
          style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          DEMO MODE
        </span>
      )}
    </header>
  );
}
