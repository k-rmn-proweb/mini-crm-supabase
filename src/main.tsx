import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from '@/app'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root-элемент #root не найден в index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
