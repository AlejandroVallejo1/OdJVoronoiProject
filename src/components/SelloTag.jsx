export function SelloTag({ text }) {
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
