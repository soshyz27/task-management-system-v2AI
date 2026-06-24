import axios from "axios";

const api = axios.create({
  // Tự động đọc link API tương ứng với môi trường đang chạy
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;