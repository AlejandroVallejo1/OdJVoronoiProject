import { useState, useRef, useEffect, useCallback } from "react";

// ============================================================
// API Service Layer — swap demo for real endpoints later
// ============================================================
const API_BASE = import.meta.env.VITE_API_BASE || "";

const DEMO_PRODUCTS = [
  {
    id: "1",
    name: "Coca-Cola Original 600ml",
    brand: "Coca-Cola",
    category: "Bebidas",
    healthScore: 15,
    calories: 252,
    sugar_g: 63,
    sodium_mg: 50,
    fat_g: 0,
    saturated_fat_g: 0,
    fiber_g: 0,
    protein_g: 0,
    sellos: ["EXCESO CALORÍAS", "EXCESO AZÚCARES"],
    recommendation:
      "Altísimo en azúcar. Considera agua mineral o agua natural como alternativa.",
    bbox: { x: 5, y: 10, w: 18, h: 35 },
  },
  {
    id: "2",
    name: "Sabritas Original 45g",
    brand: "Sabritas",
    category: "Botanas",
    healthScore: 28,
    calories: 230,
    sugar_g: 1,
    sodium_mg: 180,
    fat_g: 15,
    saturated_fat_g: 2,
    fiber_g: 1,
    protein_g: 2,
    sellos: ["EXCESO CALORÍAS", "EXCESO SODIO", "EXCESO GRASAS SATURADAS"],
    recommendation:
      "Alto en calorías, sodio y grasas. Para botana más ligera prueba cacahuates naturales o jícama.",
    bbox: { x: 25, y: 8, w: 18, h: 30 },
  },
  {
    id: "3",
    name: "Bimbo Integral",
    brand: "Bimbo",
    category: "Pan",
    healthScore: 55,
    calories: 65,
    sugar_g: 3,
    sodium_mg: 130,
    fat_g: 1,
    saturated_fat_g: 0.3,
    fiber_g: 2.5,
    protein_g: 3,
    sellos: ["EXCESO SODIO"],
    recommendation:
      "Opción moderada. Tiene fibra pero algo de sodio. Aceptable para un sándwich rápido.",
    bbox: { x: 48, y: 12, w: 16, h: 28 },
  },
  {
    id: "4",
    name: "Yoghurt Griego Lala Natural",
    brand: "Lala",
    category: "Lácteos",
    healthScore: 78,
    calories: 90,
    sugar_g: 4,
    sodium_mg: 45,
    fat_g: 3,
    saturated_fat_g: 2,
    fiber_g: 0,
    protein_g: 12,
    sellos: [],
    recommendation:
      "Buena fuente de proteína y bajo en azúcar. Una de las mejores opciones del estante.",
    bbox: { x: 68, y: 10, w: 14, h: 32 },
  },
  {
    id: "5",
    name: "Agua Ciel 600ml",
    brand: "Ciel",
    category: "Bebidas",
    healthScore: 100,
    calories: 0,
    sugar_g: 0,
    sodium_mg: 0,
    fat_g: 0,
    saturated_fat_g: 0,
    fiber_g: 0,
    protein_g: 0,
    sellos: [],
    recommendation: "La mejor opción para hidratarte. Sin calorías, sin azúcar, sin sellos.",
    bbox: { x: 85, y: 8, w: 12, h: 35 },
  },
  {
    id: "6",
    name: "Maruchan Habanero",
    brand: "Maruchan",
    category: "Sopas instantáneas",
    healthScore: 12,
    calories: 380,
    sugar_g: 2,
    sodium_mg: 1520,
    fat_g: 16,
    saturated_fat_g: 7,
    fiber_g: 1,
    protein_g: 8,
    sellos: [
      "EXCESO CALORÍAS",
      "EXCESO SODIO",
      "EXCESO GRASAS SATURADAS",
      "EXCESO GRASAS TRANS",
    ],
    recommendation:
      "Extremadamente alto en sodio (76% del límite diario). Evita si puedes.",
    bbox: { x: 30, y: 50, w: 18, h: 25 },
  },
  {
    id: "7",
    name: "Barra Nature Valley Avena y Miel",
    brand: "Nature Valley",
    category: "Barras",
    healthScore: 45,
    calories: 190,
    sugar_g: 12,
    sodium_mg: 160,
    fat_g: 6,
    saturated_fat_g: 0.5,
    fiber_g: 2,
    protein_g: 4,
    sellos: ["EXCESO CALORÍAS", "EXCESO AZÚCARES"],
    recommendation:
      "Parece sana pero tiene bastante azúcar. Una opción intermedia para snack rápido.",
    bbox: { x: 55, y: 52, w: 16, h: 22 },
  },
  {
    id: "8",
    name: "Nuez mixta Del Monte 40g",
    brand: "Del Monte",
    category: "Botanas",
    healthScore: 82,
    calories: 200,
    sugar_g: 2,
    sodium_mg: 50,
    fat_g: 18,
    saturated_fat_g: 2,
    fiber_g: 2,
    protein_g: 5,
    sellos: [],
    recommendation:
      "Grasas saludables, proteína y fibra. Excelente snack aunque calórico — controla la porción.",
    bbox: { x: 75, y: 48, w: 14, h: 26 },
  },
];

const DEMO_CHAT_RESPONSES = {
  default:
    "Basado en los productos detectados en tu foto, puedo ayudarte a elegir mejores opciones. ¿Qué te gustaría saber?",
  sana: `De los productos en el estante, las mejores opciones son:\n\n🟢 **Agua Ciel** (Score: 100) — Siempre la mejor opción para hidratarte.\n🟢 **Nuez mixta Del Monte** (Score: 82) — Grasas saludables y proteína.\n🟢 **Yoghurt Griego Lala** (Score: 78) — Alta proteína, bajo azúcar.\n\nEvita la Maruchan (Score: 12) y la Coca-Cola (Score: 15).`,
  azucar: `Productos ordenados por azúcar (de menos a más):\n\n🟢 Agua Ciel: 0g\n🟢 Sabritas: 1g\n🟡 Maruchan: 2g\n🟡 Nuez Del Monte: 2g\n🟡 Bimbo Integral: 3g\n🟡 Lala Griego: 4g\n🟠 Nature Valley: 12g ⚠️\n🔴 Coca-Cola: **63g** ⛔\n\nLa Coca-Cola tiene más de 15 cucharaditas de azúcar.`,
  proteina: `Para proteína, tus mejores opciones son:\n\n🥇 **Yoghurt Griego Lala** — 12g de proteína\n🥈 **Maruchan** — 8g pero con demasiado sodio\n🥉 **Nuez Del Monte** — 5g con grasas buenas\n\nSi buscas proteína sin sellos negativos, el yoghurt griego es la clara ganadora.`,
  sodio: `⚠️ Cuidado con el sodio en estos productos:\n\n🔴 **Maruchan**: 1,520mg (76% del límite diario)\n🟠 Sabritas: 180mg\n🟡 Nature Valley: 160mg\n🟡 Bimbo Integral: 130mg\n🟢 Coca-Cola: 50mg\n🟢 Nuez Del Monte: 50mg\n🟢 Lala Griego: 45mg\n🟢 Agua Ciel: 0mg\n\nLa Maruchan sola casi cubre tu límite diario de sodio.`,
};

const apiService = {
  async analyzeShelf(imageFile) {
    if (!API_BASE) {
      await new Promise((r) => setTimeout(r, 2200));
      return { products: DEMO_PRODUCTS, isDemo: true };
    }
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Analysis failed");
    return res.json();
  },

  async chat(message, productContext) {
    if (!API_BASE) {
      await new Promise((r) => setTimeout(r, 900));
      const lower = message.toLowerCase();
      if (lower.includes("sana") || lower.includes("mejor") || lower.includes("recomiend"))
        return { reply: DEMO_CHAT_RESPONSES.sana };
      if (lower.includes("azúcar") || lower.includes("azucar") || lower.includes("dulce"))
        return { reply: DEMO_CHAT_RESPONSES.azucar };
      if (lower.includes("proteína") || lower.includes("proteina"))
        return { reply: DEMO_CHAT_RESPONSES.proteina };
      if (lower.includes("sodio") || lower.includes("sal"))
        return { reply: DEMO_CHAT_RESPONSES.sodio };
      return { reply: DEMO_CHAT_RESPONSES.default };
    }
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, products: productContext }),
    });
    if (!res.ok) throw new Error("Chat failed");
    return res.json();
  },
};

// ============================================================
// Helpers
// ============================================================
function getScoreColor(score) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#eab308";
  if (score >= 30) return "#f97316";
  return "#ef4444";
}

function getScoreLabel(score) {
  if (score >= 75) return "Saludable";
  if (score >= 50) return "Moderado";
  if (score >= 30) return "Poco saludable";
  return "Evitar";
}

function getScoreEmoji(score) {
  if (score >= 75) return "🟢";
  if (score >= 50) return "🟡";
  if (score >= 30) return "🟠";
  return "🔴";
}

function SelloTag({ text }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: "#1a1a1a",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 4,
        marginRight: 4,
        marginBottom: 4,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.02em",
        textTransform: "uppercase",
      }}
    >
      ⚠ {text}
    </span>
  );
}

// ============================================================
// Components
// ============================================================

function ScoreRing({ score, size = 56 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={4}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        style={{
          fontSize: size * 0.32,
          fontWeight: 800,
          fontFamily: "'Space Mono', monospace",
        }}
      >
        {score}
      </text>
    </svg>
  );
}

function ShelfOverview({ products }) {
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

function ProductCard({ product, onClick, isSelected }) {
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

function ProductDetail({ product, onClose }) {
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

function ChatPanel({ products }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `¡Hola! Analicé **${products.length} productos** en tu foto. Pregúntame lo que quieras sobre nutrición, comparaciones, o qué opción es más sana.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const { reply } = await apiService.chat(text, products);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error al procesar. Intenta de nuevo." },
      ]);
    }
    setLoading(false);
  }, [input, loading, products]);

  const quickQuestions = [
    "¿Cuál es la opción más sana?",
    "¿Qué tiene menos azúcar?",
    "¿Cuál tiene más proteína?",
    "¿Cuáles tienen mucho sodio?",
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        height: 460,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid #f3f4f6",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: "#111827",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>💬</span> Pregunta sobre tu estante
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
            }}
          >
            <div
              style={{
                background: msg.role === "user" ? "#111827" : "#f9fafb",
                color: msg.role === "user" ? "#fff" : "#374151",
                padding: "10px 14px",
                borderRadius:
                  msg.role === "user"
                    ? "14px 14px 4px 14px"
                    : "14px 14px 14px 4px",
                fontSize: 13,
                lineHeight: 1.5,
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "pre-line",
              }}
              dangerouslySetInnerHTML={{
                __html: msg.text
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        ))}
        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#f9fafb",
              padding: "10px 18px",
              borderRadius: "14px 14px 14px 4px",
              fontSize: 13,
              color: "#9ca3af",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Analizando...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 2 && (
        <div
          style={{
            padding: "0 16px 8px",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(q);
                setTimeout(() => {
                  setInput(q);
                  const fakeEvent = { key: "Enter" };
                  // trigger send
                }, 0);
              }}
              onDoubleClick={() => {}}
              style={{
                background: "#f3f4f6",
                border: "none",
                borderRadius: 20,
                padding: "6px 12px",
                fontSize: 11,
                color: "#374151",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#e5e7eb")}
              onMouseOut={(e) => (e.target.style.background = "#f3f4f6")}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="¿Qué quieres saber sobre estos productos?"
          style={{
            flex: 1,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            background: "#fafafa",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? "#d1d5db" : "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 700,
            cursor: loading || !input.trim() ? "default" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.15s",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

function UploadView({ onAnalyze }) {
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const streamRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
    stopCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
      });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      alert("No se pudo acceder a la cámara.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const f = new File([blob], "capture.jpg", { type: "image/jpeg" });
      handleFile(f);
    }, "image/jpeg");
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: 24,
      }}
    >
      <div
        style={{
          fontSize: 48,
          marginBottom: 8,
        }}
      >
        🔍
      </div>
      <h2
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 26,
          fontWeight: 800,
          color: "#111827",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Escanea un estante
      </h2>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          color: "#6b7280",
          textAlign: "center",
          maxWidth: 400,
          lineHeight: 1.5,
          marginBottom: 32,
        }}
      >
        Toma una foto o sube una imagen de un estante de tienda para analizar la
        salud nutricional de los productos.
      </p>

      {showCamera && !preview && (
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              maxWidth: 480,
              borderRadius: 16,
              border: "2px solid #e5e7eb",
            }}
          />
          <div style={{ marginTop: 12, display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={capturePhoto}
              style={{
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              📸 Capturar
            </button>
            <button
              onClick={stopCamera}
              style={{
                background: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: 12,
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              maxWidth: 480,
              borderRadius: 16,
              border: "2px solid #e5e7eb",
              objectFit: "cover",
            }}
          />
          <div style={{ marginTop: 12, display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={() => onAnalyze(file)}
              style={{
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "transform 0.1s",
              }}
              onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
            >
              🔬 Analizar productos
            </button>
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
              }}
              style={{
                background: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: 14,
                padding: "14px 20px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cambiar
            </button>
          </div>
        </div>
      )}

      {!showCamera && !preview && (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileRef.current?.click()}
            style={{
              width: "100%",
              maxWidth: 440,
              border: `2px dashed ${dragOver ? "#111827" : "#d1d5db"}`,
              borderRadius: 20,
              padding: "40px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver ? "#f9fafb" : "#fff",
              transition: "all 0.2s",
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Arrastra una imagen aquí
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "#9ca3af",
                marginTop: 4,
              }}
            >
              o haz clic para seleccionar
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          <button
            onClick={startCamera}
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "14px 32px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            📷 Usar cámara
          </button>

          <button
            onClick={() => onAnalyze(null)}
            style={{
              background: "none",
              border: "none",
              marginTop: 24,
              fontSize: 13,
              color: "#9ca3af",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Ver demo sin foto →
          </button>
        </>
      )}
    </div>
  );
}

function LoadingView() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 20,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #111827",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        Analizando productos...
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#9ca3af",
        }}
      >
        Identificando SKUs y calculando scores nutricionales
      </div>
    </div>
  );
}

function ResultsView({ products, onReset }) {
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
            {products.length} productos detectados · Demo mode
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
      >
        {/* Left column: product list */}
        <div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {[
              { val: "score-asc", label: "Menos sano primero" },
              { val: "score-desc", label: "Más sano primero" },
              { val: "sellos", label: "Más sellos" },
              { val: "name", label: "A-Z" },
            ].map((opt) => (
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

        {/* Right column: detail + chat */}
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

// ============================================================
// App
// ============================================================
export default function App() {
  const [view, setView] = useState("upload"); // upload | loading | results
  const [products, setProducts] = useState([]);

  const handleAnalyze = async (imageFile) => {
    setView("loading");
    try {
      const data = await apiService.analyzeShelf(imageFile);
      setProducts(data.products);
      setView("results");
    } catch {
      alert("Error al analizar. Intenta de nuevo.");
      setView("upload");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Space+Mono:wght@400;700&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          font-family: 'DM Sans', sans-serif;
          background: #f5f5f4;
          color: #111827;
          -webkit-font-smoothing: antialiased;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .results-grid {
            grid-template-columns: 1fr !important;
          }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `}</style>

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "20px 24px 60px",
        }}
      >
        {/* Header */}
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

        {/* Views */}
        {view === "upload" && <UploadView onAnalyze={handleAnalyze} />}
        {view === "loading" && <LoadingView />}
        {view === "results" && (
          <ResultsView
            products={products}
            onReset={() => {
              setView("upload");
              setProducts([]);
            }}
          />
        )}
      </div>
    </>
  );
}