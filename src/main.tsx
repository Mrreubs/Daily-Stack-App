import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: '2rem', color: '#1C1917', fontFamily: 'Inter, sans-serif' }}>Something went wrong. <button onClick={() => window.location.reload()} style={{ marginLeft: '0.5rem', padding: '0.25rem 0.75rem', cursor: 'pointer' }}>Reload</button></div>;
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
