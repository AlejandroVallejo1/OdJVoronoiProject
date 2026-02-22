export function LoadingView() {
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
