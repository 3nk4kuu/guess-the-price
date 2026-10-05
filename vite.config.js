import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import gameDetails from './api/game-details.js'

function localGameDetails() {
  return {
    name: 'local-game-details',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.envDir, 'RAWG_')
      if (!process.env.RAWG_KEY && env.RAWG_KEY) process.env.RAWG_KEY = env.RAWG_KEY
      server.middlewares.use((request, response, next) => {
        if (new URL(request.url, 'http://localhost').pathname !== '/api/game-details') return next()
        response.status = code => { response.statusCode = code; return response }
        response.json = data => {
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(data))
        }
        gameDetails(request, response).catch(() => {
          response.status(500).json({ error: 'Could not load game details.' })
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localGameDetails()],
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
      '@mui/material/Tooltip',
      '@mui/material/Select',
      '@mui/material/MenuItem',
      '@mui/icons-material/KeyboardArrowDownRounded',
    ],
  },
})
