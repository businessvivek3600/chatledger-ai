/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/design-system/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Official White-First Enterprise SaaS Tokens
        enterprise: {
          bg: "#F7F8FA",          // Primary Background
          surface: "#FFFFFF",     // Main Surface
          subtle: "#F2F4F7",      // Subtle Surface
          border: "#E6EAF0",      // Subtle Border
          navy: "#243B5A",        // Primary Navy
          blue: "#356AE6",        // Primary Blue
          blueLight: "#6D8ED8",   // Secondary Blue
          text: "#202938",        // Main Text
          textSecondary: "#707B8B", // Secondary Text
          textMuted: "#98A2B3",   // Muted Text
          success: "#23865B",     // Success
          warning: "#B98535",     // Warning
          danger: "#D64B50",      // Danger
          info: "#4775B8",        // Info
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(16, 24, 40, 0.04)",
        card: "0 1px 3px 0 rgba(16, 24, 40, 0.05)",
        popover: "0 10px 15px -3px rgba(16, 24, 40, 0.08), 0 4px 6px -4px rgba(16, 24, 40, 0.04)",
      },
    },
  },
  plugins: [],
}
