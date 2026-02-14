import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#111', color: '#fff', border: '1px solid #262626', fontSize: '13px' },
          success: { iconTheme: { primary: '#32cd32', secondary: '#000' } },
        }}
      />
    </BrowserRouter>
  </StrictMode>
)
