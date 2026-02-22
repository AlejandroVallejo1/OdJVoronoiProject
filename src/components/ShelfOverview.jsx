import { getScoreColor, getScoreLabel } from "../utils/scoreUtils.js";

export function ShelfOverview({ products }) {
  const avg =
    products.reduce((s, p) => s + p.healthScore, 0) / products.length;
  const best = products.reduce((a, b) =>
    a.healthScore > b.healthScore ? a : b
  );
  const worst = products.reduce((a, b) =>
    a.healthScore < b.healthScore ? a : b
  );
  const noSellos = products.filter((p) => p.sellos.length === 0).length;

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
      {[
        {
          label: "Promedio del estante",
          value: Math.round(avg),
          sub: getScoreLabel(avg),
          color: getScoreColor(avg),
        },
        {
          label: "Mejor opción",
          value: best.name.split(" ").slice(0, 2).join(" "),
          sub: `Score: ${best.healthScore}`,
          color: "#22c55e",
        },
        {
          label: "Peor opción",
          value: worst.name.split(" ").slice(0, 2).join(" "),
          sub: `Score: ${worst.healthScore}`,
          color: "#ef4444",
        },
        {
          label: "Sin sellos",
          value: `${noSellos}/${products.length}`,
          sub: "productos limpios",
          color: "#22c55e",
        },
      ].map((card, i) => (
        <div
          key={i}
          style={{
            flex: "1 1 140px",
            background: "#fff",
            borderRadius: 14,
            padding: "14px 16px",
            border: "1px solid #e5e7eb",
            minWidth: 140,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#6b7280",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: 6,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {card.label}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: card.color,
              fontFamily: "'Space Mono', monospace",
              lineHeight: 1.2,
            }}
          >
            {card.value}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#9ca3af",
              marginTop: 2,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
