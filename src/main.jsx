import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
import StorePage from './StorePage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StorePage />
  </StrictMode>,
)
