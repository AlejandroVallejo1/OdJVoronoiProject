import { useState } from "react";
import { apiService } from "./services/apiService.js";
import { AppHeader } from "./components/AppHeader.jsx";
import { UploadView } from "./components/UploadView.jsx";
import { LoadingView } from "./components/LoadingView.jsx";
import { ResultsView } from "./components/ResultsView.jsx";
import { ErrorView } from "./components/ErrorView.jsx";

const GLOBAL_STYLES = `
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
`;

export default function App() {
  const [view, setView] = useState("upload");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const handleAnalyze = async (imageFile) => {
    console.log("[App.handleAnalyze] Llamada. imageFile =", imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : "null");
    setError(null);
    setView("loading");
    try {
      const data = await apiService.analyzeShelf(imageFile);
      console.log("[App.handleAnalyze] OK. products.length =", data?.products?.length, "| isDemo =", data?.isDemo);
      setProducts(data.products);
      setView("results");
    } catch (err) {
      const errMsg = err?.message || "Error al analizar. Intenta de nuevo.";
      console.error("[App.handleAnalyze] Error:", errMsg);
      setError(err);
      setView("error");
    }
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "20px 24px 60px",
        }}
      >
        <AppHeader />

        {view === "upload" && <UploadView onAnalyze={handleAnalyze} />}
        {view === "loading" && <LoadingView />}
        {view === "error" && (
          <ErrorView
            error={error}
            onRetry={() => {
              setError(null);
              setView("upload");
            }}
          />
        )}
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
