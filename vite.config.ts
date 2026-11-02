import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const resumePath = fileURLToPath(new URL("./public/Angelo_Gaspe_Resume.pdf", import.meta.url));

export default defineConfig({
  plugins: [react()],
  define: {
    // The Download Resume button only renders when the PDF exists, so the
    // live site never ships a dead link.
    __HAS_RESUME__: JSON.stringify(existsSync(resumePath)),
  },
});
