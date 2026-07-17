import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
    return (
        <Router>
            <Routes>
                {/* Tuyến đường gốc: Mặc định đẩy về Login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Các tuyến đường công khai */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Tuyến đường được bảo vệ bằng JWT */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                {/*Tuyến đường admin */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                        <AdminDashboardPage />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* Tự động điều hướng về /login nếu nhập link sai */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;