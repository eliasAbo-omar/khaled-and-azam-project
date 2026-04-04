import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// تعريف المسار الحالي (ضروري لأننا نستخدم ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      // الآن @ تشير للمجلد الرئيسي للمشروع
      "@": path.resolve(__dirname, "./"),
    },
  },
});
