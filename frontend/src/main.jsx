import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // Import Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Bọc ngoài cùng hệ thống */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)