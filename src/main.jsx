import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { initTheme } from './hooks/useTheme'

initTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  </StrictMode>,
)
