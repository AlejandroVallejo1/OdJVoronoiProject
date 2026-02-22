import { useState, useRef, useEffect, useCallback } from "react";
import { apiService } from "../services/apiService.js";

const QUICK_QUESTIONS = [
  "¿Cuál es la opción más sana?",
  "¿Qué tiene menos azúcar?",
  "¿Cuál tiene más proteína?",
  "¿Cuáles tienen mucho sodio?",
];

export function ChatPanel({ products }) {
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

  const sendMessage = useCallback(
    async (textOverride) => {
      const text = (textOverride ?? input).trim();
      if (!text || loading) return;
      if (!textOverride) setInput("");
      setMessages((prev) => [...prev, { role: "user", text }]);
      setLoading(true);
      try {
        const { reply } = await apiService.chat(text, products);
        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      } catch (err) {
        const msg = err?.message || "Error al procesar. Intenta de nuevo.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: `❌ ${msg}` },
        ]);
      }
      setLoading(false);
    },
    [input, loading, products]
  );

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
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
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
          onClick={() => sendMessage()}
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
