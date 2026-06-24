import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor phản hồi lỗi toàn cục (Bước 11)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            
            if (status === 401) {
                // 🔴 BỎ LỆNH ALERT CHẶN BẤM: Hệ thống tự dọn bộ nhớ và đá về trang login liền mạch
                localStorage.clear();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;