import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        // Core Theme Colors
        primary: "#0F172A",    // Deep space dark
        accent: {
          indigo: "#6366F1",   // Electric indigo
          purple: "#8B5CF6",   // Cosmic purple
          teal: "#0EA5E9",     // Digital teal
        },
        light: "#F8FAFC",      // Light cosmic theme

        // Functional Colors
        background: {
          DEFAULT: "#0F172A",
          light: "#F8FAFC",
        },
        foreground: {
          DEFAULT: "#F8FAFC",
          dark: "#0F172A",
        },
        
        // Section-specific colors
        section: {
          features: "#F8FAFC",
          stats: "#0F172A",
          howItWorks: "#2D1B69",
          pricing: "#F8FAFC",
          questions: "#0F172A",
        },

        // UI Elements
        card: {
          DEFAULT: "#1E293B",
          hover: "#334155",
        },
        border: {
          DEFAULT: "#334155",
          light: "#E2E8F0",
        },

        // Main colors
        secondary: "#393E46", // Grey - supporting background
        accent: "#00ADB5", // Teal - highlight and interactive
        light: "#EEEEEE", // Light Grey/White - text and foreground

        // Functional colors
        background: "#222831", // Now using primary as background
        foreground: "#EEEEEE", // Using light for readability

        muted: {
          DEFAULT: "#222831", // Use primary instead of secondary
          foreground: "#EEEEEE",
        },

        popover: {
          DEFAULT: "#222831", // Should match primary, not secondary
          foreground: "#EEEEEE",
        },

        input: "#222831", // Inputs should blend with primary

        // Button and interactive states
        ring: "#00ADB5", // Accent for interaction
        focus: "#00ADB5", // Accent for focused elements

        destructive: {
          DEFAULT: "#ff4444",
          foreground: "#EEEEEE",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.4rem",
        sm: "0.3rem",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      fontSize: {
        // Typography scale
        h1: ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        h2: ["3rem", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["2rem", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        feature: ["1.25rem", { lineHeight: "1.6" }],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-mesh": "radial-gradient(at 50% 50%, var(--accent-indigo) 0%, transparent 50%)",
        "noise": "url('/noise.svg')",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
