import AxiosInstance from '../utils/AxiosInstance';

// 🔹 Save data in localStorage
export const saveAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// 🔹 Clear saved auth
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// 🔹 Login API call
export const loginService = async (credentials) => {
  const { data } = await AxiosInstance.post("/auth/login", credentials);
  if (!data.token || !data.user) {
    console.error("🚨 Missing token or user in response:", data);
    throw new Error("Invalid login response");
  }

  return {
    token: data.token,
    user: data.user,
  };
};

// 🔹 Registration
export const registerService = async (data) => {
  const response = await AxiosInstance.post("/auth/signup", data);
  return response.data;
};