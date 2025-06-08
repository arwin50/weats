import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Public API instance (no auth required)
export const publicApi = axios.create({
  baseURL: "https://weats-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Authorized API instance
export const authApi = axios.create({
  baseURL: "https://weats-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await publicApi.post("/users/refresh/", {
          refresh: refreshToken,
        });

        if (response.data.access) {
          localStorage.setItem("access_token", response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login on refresh failure
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    formData: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await publicApi.post("/users/register", formData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || { message: "Registration failed" }
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    formData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await publicApi.post("/users/login", formData);
      const { access, refresh, user } = response.data;

      console.log(response.data);

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      return { access, refresh, user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  await authApi.post("/users/logout");
});

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return rejectWithValue({ message: "No refresh token" });

    try {
      const response = await publicApi.post("/users/refresh", { refresh });
      const { access } = response.data;
      localStorage.setItem("access_token", access);
      return access;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || { message: "Refresh failed" }
      );
    }
  }
);

export const getUserData = createAsyncThunk(
  "auth/user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.get("/users/user");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch user" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        const userStr = localStorage.getItem("user");

        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = !!accessToken;

        if (userStr) {
          try {
            state.user = JSON.parse(userStr);
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      });
  },
});

export const { clearAuthState, clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
