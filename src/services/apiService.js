const API_BASE = import.meta.env.VITE_API_BASE || "";

/** Log al cargar */
console.log("[apiService] VITE_API_BASE =", API_BASE || "(vacío)");
if (!API_BASE) {
  console.warn("[apiService] No hay VITE_API_BASE. En Amplify: Hosting → Environment variables.");
}

/** Endpoints del backend (se usan cuando VITE_API_BASE está definido) */
const ENDPOINTS = {
  analyze: "/analyze",
  chat: "/chat",
};

export { API_BASE, ENDPOINTS };

/**
 * Intenta leer el cuerpo de error de la respuesta y devuelve un mensaje legible.
 */
async function getErrorMessage(res) {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json.message || json.error || text || `Error ${res.status}`;
  } catch {
    return text || `Error ${res.status} ${res.statusText}`;
  }
}

export const apiService = {
  async analyzeShelf(imageFile) {
    const url = `${API_BASE}${ENDPOINTS.analyze}`;
    const imgInfo = imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : "null";
    console.log("[apiService.analyzeShelf] Inicio. URL =", url, "| imageFile =", imgInfo);

    if (!API_BASE) {
      const msg =
        "API no configurada. Añade VITE_API_BASE en .env (local) o en Amplify → Hosting → Environment variables (producción).";
      console.error("[apiService.analyzeShelf]", msg);
      throw new Error(msg);
    }

    try {
      const formData = new FormData();
      if (imageFile) formData.append("image", imageFile);
      console.log("[apiService.analyzeShelf] POST", url);
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      console.log("[apiService.analyzeShelf] Response status =", res.status, res.statusText, "| ok =", res.ok);

      if (!res.ok) {
        const msg = await getErrorMessage(res);
        console.error("[apiService.analyzeShelf] ERROR HTTP", res.status, "| URL:", url, "| Mensaje:", msg);
        throw new Error(msg);
      }
      const data = await res.json();
      console.log("[apiService.analyzeShelf] OK. products count =", data?.products?.length ?? 0);
      return data;
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        console.error("[apiService.analyzeShelf] Failed to fetch (red/CORS). URL:", url);
        throw new Error(
          `No se pudo conectar al servidor. Revisa que ${API_BASE} esté en línea y CORS permita el origen.`
        );
      }
      console.error("[apiService.analyzeShelf] Error:", err?.message ?? err);
      throw err;
    }
  },

  async chat(message, productContext) {
    const url = `${API_BASE}${ENDPOINTS.chat}`;
    console.log("[apiService.chat] Inicio. URL =", url, "| message =", message?.slice(0, 50));

    if (!API_BASE) {
      const msg =
        "API no configurada. Añade VITE_API_BASE en .env (local) o en Amplify → Hosting → Environment variables (producción).";
      console.error("[apiService.chat]", msg);
      throw new Error(msg);
    }

    try {
      const body = { message, products: productContext };
      console.log("[apiService.chat] POST", url, "| body.products.length =", body.products?.length);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("[apiService.chat] Response status =", res.status, res.statusText, "| ok =", res.ok);

      if (!res.ok) {
        const msg = await getErrorMessage(res);
        console.error("[apiService.chat] ERROR HTTP", res.status, "| URL:", url, "| Mensaje:", msg);
        throw new Error(msg);
      }
      const data = await res.json();
      console.log("[apiService.chat] OK. reply length =", data?.reply?.length ?? 0);
      return data;
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        console.error("[apiService.chat] Failed to fetch (red/CORS). URL:", url);
        throw new Error(
          `No se pudo conectar al servidor. Revisa que ${API_BASE} esté en línea y CORS permita el origen.`
        );
      }
      console.error("[apiService.chat] Error:", err?.message ?? err);
      throw err;
    }
  },
};
