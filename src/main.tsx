
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getCurrentEnvironment } from './integrations/supabase/client.ts'

// Log environment in development mode
if (import.meta.env.DEV) {
  console.log(`Running in ${getCurrentEnvironment()} environment`);
}

createRoot(document.getElementById("root")!).render(<App />);
