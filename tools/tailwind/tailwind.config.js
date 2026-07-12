const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Absolute paths so the build works regardless of the cwd it's run from.
  content: [
    path.join(__dirname, '../../versions/v2/index.html'),
    path.join(__dirname, '../../versions/v2/main.js'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: '#fbfbfa',
        ink: '#0e0e0d',
        muted: '#6b6b66',
        line: '#e4e2dd',
        accent: '#ea580c',
        body: '#4d4c46',
      },
      letterSpacing: { label: '0.18em' },
    },
  },
};
