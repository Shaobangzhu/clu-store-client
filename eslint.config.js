import tseslint from "typescript-eslint";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ['src/api/**/*.ts', 'src/auth/*.ts', 'src/redux/userSlice.ts', 'src/redux/store.ts', 'src/AppInit.ts', 'src/App.tsx', 'src/HOCs/RequireAuth.tsx', 'src/pages/SignIn.tsx', 'src/pages/Register.tsx', 'src/contexts/shoppingCart/shoppingCartProvider.tsx', 'src/helpers/api.ts', 'src/helpers/loaders.ts', 'src/hooks/useApi*.ts', 'src/hooks/useShoppingCartAction.ts', 'src/hooks/useProductSelection.ts', 'src/redux/searchSlice.ts', 'src/pages/Home.tsx', 'src/pages/Category.tsx', 'src/pages/SearchResults.tsx', 'src/pages/ProductDetail/*.tsx', 'src/components/{CatalogStatus,ProductImage,ProductHero,CompareTable,SearchResultCard,ProductList,ImageHero,SkuSelect,Offer,NewArrival,VideoHero,ImageSlider}.tsx', 'tests/**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
  },
  { files: ['scripts/**/*.mjs', '*config*.{js,ts}'], languageOptions: { globals: globals.node } },
  globalIgnores(["dist", "src/api/schema.d.ts"]),
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react,
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^[A-Z_]", varsIgnorePattern: "^[A-Z_]" },
      ],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-param-reassign": [
        "warn",
        {
          props: true,
          ignorePropertyModificationsFor: ["ref"],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
