import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Session management
let refreshTokenTimeout: NodeJS.Timeout;

const startRefreshTokenTimer = (expiresIn: number) => {
  // Refresh token 1 minute before it expires
  const timeout = (expiresIn - 60) * 1000;
  refreshTokenTimeout = setTimeout(() => {
    refreshToken();
  }, timeout);
};

const stopRefreshTokenTimer = () => {
  clearTimeout(refreshTokenTimeout);
};

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });
      const { accessToken, refreshToken, user, expiresIn } = response.data;

      // Store tokens and user in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Start refresh token timer
      startRefreshTokenTimer(expiresIn);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Register thunk
export const register = createAsyncThunk(
  "auth/register",
  async (
    formData: {
      username: string;
      email: string;
      password: string;
      password_confirmation: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await api.post("/users/register", formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        // Handle field-specific errors
        if (errorData.username) {
          return thunkAPI.rejectWithValue(errorData.username[0]);
        }
        if (errorData.email) {
          return thunkAPI.rejectWithValue(errorData.email[0]);
        }
        if (errorData.password) {
          return thunkAPI.rejectWithValue(errorData.password[0]);
        }
        if (errorData.password_confirmation) {
          return thunkAPI.rejectWithValue(errorData.password_confirmation[0]);
        }
        // Handle general error message
        if (errorData.message) {
          return thunkAPI.rejectWithValue(errorData.message);
        }
        // Handle non-field errors
        if (errorData.non_field_errors) {
          return thunkAPI.rejectWithValue(errorData.non_field_errors[0]);
        }
      }
      // Fallback error message
      return thunkAPI.rejectWithValue("Registration failed. Please try again.");
    }
  }
);

// Refresh token thunk
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/users/refresh", { refreshToken });
      const { accessToken, expiresIn } = response.data;

      // Update access token in localStorage
      localStorage.setItem("accessToken", accessToken);

      // Restart refresh token timer
      startRefreshTokenTimer(expiresIn);

      return accessToken;
    } catch (error: any) {
      // Clear auth state on refresh token failure
      thunkAPI.dispatch(logout());
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Session expired"
      );
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await api.post("/users/logout", { refreshToken });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear auth state and stop refresh timer
    stopRefreshTokenTimer();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
});

// Clear error
export const clearError = () => (dispatch: any) => {
  dispatch(authSlice.actions.setError(null));
};

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  hasUsedApp: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem("accessToken")
      : false,
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  hasUsedApp:
    typeof window !== "undefined"
      ? localStorage.getItem("hasUsedApp") === "true"
      : false,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  refreshToken:
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.accessToken = token;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    markAppAsUsed: (state) => {
      state.hasUsedApp = true;
      localStorage.setItem("hasUsedApp", "true");
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
      });
  },
});

// Configure axios interceptors for automatic token refresh
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const result = await refreshToken();
        if ("payload" in result) {
          const accessToken = result.payload;
          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
        throw new Error("Failed to refresh token");
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const { setCredentials, markAppAsUsed, setError } = authSlice.actions;
export default authSlice.reducer;
