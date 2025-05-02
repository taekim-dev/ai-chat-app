/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          50: '#f0f6ff',
          100: '#e0eeff',
          200: '#baddff',
          300: '#7cc3ff',
          400: '#3aa1ff',
          500: '#1a7fff',  // Main primary color
          600: '#0062e6',
          700: '#004ebd',
          800: '#004099',
          900: '#003580',
        },
        // Semantic colors
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
        // UI colors
        surface: {
          50: '#ffffff',
          100: '#f9fafb',
          200: '#f3f4f6',
          300: '#e5e7eb',
          400: '#d1d5db',
        },
        content: {
          50: '#9ca3af',
          100: '#6b7280',
          200: '#4b5563',
          300: '#374151',
          400: '#1f2937',
        },
      },
      spacing: {
        // Systematic spacing scale
        'xs': '0.25rem',    // 4px
        'sm': '0.5rem',     // 8px
        'md': '1rem',       // 16px
        'lg': '1.5rem',     // 24px
        'xl': '2rem',       // 32px
        '2xl': '3rem',      // 48px
      },
      borderRadius: {
        'xs': '0.25rem',    // 4px
        'sm': '0.375rem',   // 6px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
      },
      fontSize: {
        'xs': ['0.75rem', '1rem'],      // 12px
        'sm': ['0.875rem', '1.25rem'],  // 14px
        'base': ['1rem', '1.5rem'],     // 16px
        'lg': ['1.125rem', '1.75rem'],  // 18px
        'xl': ['1.25rem', '1.75rem'],   // 20px
        '2xl': ['1.5rem', '2rem'],      // 24px
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
} 