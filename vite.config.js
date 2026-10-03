import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Keep the renderer and MUI on the same React and Emotion instances.
  resolve: {
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
  // Optimize UI dependencies together at startup to avoid mixed bundles after HMR.
  optimizeDeps: {
    include: [
      'react',
      'react-dom/client',
      '@emotion/react',
      '@emotion/styled',
      '@mui/material/styles',
      '@mui/material/CssBaseline',
      '@mui/material/Dialog',
      '@mui/material/Select',
      '@mui/material/MenuItem',
      '@mui/icons-material/KeyboardArrowDownRounded',
    ],
  },
})
