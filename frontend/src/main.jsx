import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx' 
import { ThemeProvider } from './context/ThemeContext.jsx' // 1. Hãy đổi đường dẫn này cho đúng với file chứa ThemeProvider bạn vừa tìm được
import './styles/theme.css' // File CSS giao diện vẫn giữ nguyên

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Bọc lại ThemeProvider ở ngoài cùng */}
    <ThemeProvider>      
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)