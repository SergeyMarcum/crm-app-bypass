// src/pages/login/index.tsx
import React, { useEffect, useReducer } from "react";
import { Box, Snackbar, Typography } from "@mui/material";
import { useAuthStore } from "@/features/auth/store";
import { useNavigate } from "react-router-dom";
import LoginForm, { LoginFormData } from "@/features/auth/components/LoginForm";

const initialState = {
  errorMessage: "",
};

type Action = { type: "SET_ERROR"; error: string };

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, errorMessage: action.error };
    default:
      return state;
  }
};

const LoginPage: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { login, isAuthenticated, isTestMode } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated || isTestMode) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isTestMode, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      localStorage.setItem("apiMode", data.testMode ? "test" : "real");
      await login(data.username, data.password, data.domain, data.testMode);
      navigate("/dashboard");
    } catch (error: unknown) {
      dispatch({
        type: "SET_ERROR",
        error:
          error instanceof Error
            ? error.message
            : "Неизвестная ошибка авторизации",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "grey.100",
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" mb={2} textAlign="center">
          Авторизация
        </Typography>
        <LoginForm onSubmit={handleLogin} />
        <Snackbar
          open={!!state.errorMessage}
          autoHideDuration={6000}
          onClose={() => dispatch({ type: "SET_ERROR", error: "" })}
          message={state.errorMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Box>
    </Box>
  );
};

export default LoginPage;
