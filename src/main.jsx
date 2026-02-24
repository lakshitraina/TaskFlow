import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { TaskProvider } from './context/TaskContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { TeamProvider } from './context/TeamContext.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <TaskProvider>
        <SettingsProvider>
          <ErrorBoundary>
            <TeamProvider>
              <App />
            </TeamProvider>
          </ErrorBoundary>
        </SettingsProvider>
      </TaskProvider>
    </ThemeProvider>
  </StrictMode>,
)
