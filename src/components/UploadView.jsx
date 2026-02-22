import { useState, useRef, useEffect } from "react";

export function UploadView({ onAnalyze }) {
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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
      <div style={{ fontSize: 48, marginBottom: 8 }}>🔍</div>
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
