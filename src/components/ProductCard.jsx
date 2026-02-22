import { getScoreColor } from "../utils/scoreUtils.js";
import { ScoreRing } from "./ScoreRing.jsx";
import { SelloTag } from "./SelloTag.jsx";

export function ProductCard({ product, onClick, isSelected }) {
  const color = getScoreColor(product.healthScore);
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? `${color}08` : "#fff",
        borderRadius: 16,
        border: isSelected ? `2px solid ${color}` : "1px solid #e5e7eb",
        padding: 16,
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: color,
          borderRadius: "16px 16px 0 0",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 4,
            }}
          >
            {product.category} · {product.brand}
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.3,
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 8,
            }}
          >
            {product.name}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
            {product.sellos.length > 0 ? (
              product.sellos.map((s, i) => <SelloTag key={i} text={s} />)
            ) : (
              <span
                style={{
                  fontSize: 11,
                  color: "#22c55e",
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ✓ Sin sellos de advertencia
              </span>
            )}
          </div>
        </div>
        <ScoreRing score={product.healthScore} />
      </div>
    </div>
  );
}
