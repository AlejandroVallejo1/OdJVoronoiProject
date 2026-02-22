import { getScoreColor, getScoreLabel } from "../utils/scoreUtils.js";
import { ScoreRing } from "./ScoreRing.jsx";
import { SelloTag } from "./SelloTag.jsx";

export function ProductDetail({ product, onClose }) {
  const color = getScoreColor(product.healthScore);

  const nutrients = [
    { label: "Calorías", value: product.calories, unit: "kcal", limit: 300 },
    { label: "Azúcar", value: product.sugar_g, unit: "g", limit: 25 },
    { label: "Sodio", value: product.sodium_mg, unit: "mg", limit: 2000 },
    { label: "Grasa total", value: product.fat_g, unit: "g", limit: 65 },
    { label: "Grasa sat.", value: product.saturated_fat_g, unit: "g", limit: 20 },
    { label: "Fibra", value: product.fiber_g, unit: "g", limit: 25, invert: true },
    { label: "Proteína", value: product.protein_g, unit: "g", limit: 50, invert: true },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        padding: 24,
        animation: "slideUp 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {product.category} · {product.brand}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#111827",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 4,
            }}
          >
            {product.name}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: "#9ca3af",
            padding: 4,
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: `${color}0a`,
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <ScoreRing score={product.healthScore} size={72} />
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {getScoreLabel(product.healthScore)}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#6b7280",
              marginTop: 4,
              lineHeight: 1.4,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {product.recommendation}
          </div>
        </div>
      </div>

      {product.sellos.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: 8,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Sellos NOM-051
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {product.sellos.map((s, i) => (
              <SelloTag key={i} text={s} />
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 10,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Información nutricional
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {nutrients.map((n, i) => {
          const pct = n.invert
            ? Math.min((n.value / n.limit) * 100, 100)
            : Math.min((n.value / n.limit) * 100, 100);
          const barColor = n.invert
            ? n.value > n.limit * 0.3
              ? "#22c55e"
              : "#eab308"
            : pct > 60
              ? "#ef4444"
              : pct > 30
                ? "#eab308"
                : "#22c55e";
          return (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 3,
                }}
              >
                <span style={{ color: "#374151", fontWeight: 600 }}>
                  {n.label}
                </span>
                <span style={{ color: "#6b7280", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
                  {n.value}
                  {n.unit}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "#f3f4f6",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: barColor,
                    borderRadius: 3,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
