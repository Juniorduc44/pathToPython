/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
        border: "#2A3441",
        input: "#1E293B",
        ring: "#3DBBAC",
        background: "#101823",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#3DBBAC",
          foreground: "#101823",
        },
        secondary: {
          DEFAULT: "#3DBBAC",
          foreground: "#101823",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1A2331",
          foreground: "#A6B0C2",
        },
        accent: {
          DEFAULT: "#FFD700",
          foreground: "#101823",
        },
        popover: {
          DEFAULT: "#1A2331",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#1A2331",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}
