import { useState } from "react";
import { ShelfOverview } from "./ShelfOverview.jsx";
import { ProductCard } from "./ProductCard.jsx";
import { ProductDetail } from "./ProductDetail.jsx";
import { ChatPanel } from "./ChatPanel.jsx";

const SORT_OPTIONS = [
  { val: "score-asc", label: "Menos sano primero" },
  { val: "score-desc", label: "Más sano primero" },
  { val: "sellos", label: "Más sellos" },
  { val: "name", label: "A-Z" },
];

export function ResultsView({ products, onReset }) {
  const [selectedId, setSelectedId] = useState(null);
  const [sortBy, setSortBy] = useState("score-asc");

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "score-asc") return a.healthScore - b.healthScore;
    if (sortBy === "score-desc") return b.healthScore - a.healthScore;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "sellos") return b.sellos.length - a.sellos.length;
    return 0;
  });

  const selected = products.find((p) => p.id === selectedId);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 22,
              fontWeight: 800,
              color: "#111827",
              margin: 0,
            }}
          >
            Resultados del análisis
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#6b7280",
              margin: "4px 0 0",
            }}
          >
            {products.length} productos detectados
          </p>
        </div>
        <button
          onClick={onReset}
          style={{
            background: "#f3f4f6",
            border: "none",
            borderRadius: 10,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            color: "#374151",
          }}
        >
          ← Nuevo escaneo
        </button>
      </div>

      <ShelfOverview products={products} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
        className="results-grid"
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.val}
                onClick={() => setSortBy(opt.val)}
                style={{
                  background: sortBy === opt.val ? "#111827" : "#f3f4f6",
                  color: sortBy === opt.val ? "#fff" : "#6b7280",
                  border: "none",
                  borderRadius: 8,
                  padding: "5px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sorted.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isSelected={selectedId === p.id}
                onClick={() =>
                  setSelectedId(selectedId === p.id ? null : p.id)
                }
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            position: "sticky",
            top: 20,
          }}
        >
          {selected ? (
            <ProductDetail
              product={selected}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <div
              style={{
                background: "#f9fafb",
                borderRadius: 20,
                border: "1px dashed #d1d5db",
                padding: 40,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>👆</div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: "#9ca3af",
                }}
              >
                Selecciona un producto para ver su detalle nutricional
              </div>
            </div>
          )}
          <ChatPanel products={products} />
        </div>
      </div>
    </div>
  );
}
