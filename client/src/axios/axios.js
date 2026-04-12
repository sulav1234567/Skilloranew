import axios from "axios"
let url = import.meta.env.VITE_BASE_URL

const api = axios.create({
    baseURL:`${url}`,
    withCredentials:true
})

api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    console.log("INTERCEPTOR HIT");
    console.log("STATUS:", error.response?.status);
    console.log("MESSAGE:", error.response?.data?.message);
    console.log("RETRY:", originalRequest._retry);

    if (
      error.response?.status === 401 &&
      (error.response?.data?.message === "ACCESS_TOKEN_EXPIRED" || error.response?.data?.message==="Unauthorized") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh/accesstoken");
        return api(originalRequest);
      } catch (err) {
         return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api