import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage"; // Bỏ comment khi làm xong trang Register
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                {/* Thêm tuyến đường gốc: Mặc định đẩy về Login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Các tuyến đường công khai */}
                <Route path="/login" element={<LoginPage />} />
                {/* <Route path="/register" element={<RegisterPage />} /> */}

                {/* Tuyến đường được bảo vệ bằng JWT */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                {/* Tự động điều hướng về /login nếu người dùng nhập link linh tinh */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;