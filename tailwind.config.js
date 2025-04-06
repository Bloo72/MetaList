// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    'ml-20',
    'ml-60',
    'max-w-[calc(100%-5rem)]',
    'max-w-[calc(100%-15rem)]'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E3F2FD',    // Soft Light Blue (secondary backgrounds)
          100: '#BBDEFB',   // Lighter Baby Blue
          200: '#90CAF9',   // Light Baby Blue
          300: '#64B5F6',   // Baby Blue (primary color)
          400: '#42A5F5',   // Slightly deeper blue
          500: '#2196F3',    // Main interactive blue
          600: '#1E88E5',   // Deeper interactive blue
          700: '#1976D2',   // Deeper blue for contrast
          800: '#1565C0',   // Even deeper blue
          900: '#0D47A1'    // Darkest blue
        },
        text: {
          primary: '#333333',   // Charcoal Gray for text
          secondary: '#666666', // Lighter gray for secondary text
          light: '#999999'      // Light gray for less important text
        },
        background: {
          primary: '#FFFFFF',   // Pure White background
          secondary: '#E3F2FD', // Soft Light Blue for secondary backgrounds
          tertiary: '#F5F5F5'   // Light gray for tertiary backgrounds
        },
        notification: {
          red: '#FF3B30',       // Bright Red for notifications
          softRed: '#FF6B6B'    // Softer red for hover states
        },
        success: {
          green: '#4CAF50',     // Soft Green for success states
          lightGreen: '#81C784' // Lighter green for hover states
        }
      },
      borderRadius: {
        'xl': '1rem',      // Extra large rounded corners
        '2xl': '1.5rem',   // Even larger rounded corners
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'medium': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'pixel': ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [], // Remove the plugins temporarily
}