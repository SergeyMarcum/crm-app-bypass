import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] }, // Игнорируем папку dist
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"], // Применяем правила к TS и TSX файлам
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tseslint.plugin, // Добавляем плагин TypeScript
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // Правила для React Hooks
      "react-hooks/exhaustive-deps": "warn", // Предупреждение о пропущенных зависимостях в хуках
      "@typescript-eslint/no-explicit-any": "error", // Запрет использования any
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ], // Поддержка React Refresh
    },
  }
);
