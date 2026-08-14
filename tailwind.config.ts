import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf2f3", 100: "#fbe3e5", 500: "#b3122a", 600: "#960f23", 700: "#7a0c1c", 900: "#4a0711"
        }
      },
      fontFamily: { sans: ["Tajawal", "Cairo", "system-ui", "sans-serif"] }
    }
  },
  plugins: []
};
export default config;
