import React, { useEffect, useReducer } from "react";
import { Box, Snackbar, Typography } from "@mui/material";
import { useAuthStore } from "../../features/auth/store";
import { useNavigate } from "react-router-dom";
import LoginForm, {
  LoginFormData,
} from "../../features/auth/components/LoginForm";

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
      await login(data.username, data.password, data.domain, data.testMode);
      navigate("/dashboard");
    } catch (error: unknown) {
      dispatch({
        type: "SET_ERROR",
        error:
          error instanceof Error
            ? error.message
            : "Неизвестная ошибка авторизации.",
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" mb={2}>
        Вход в CRM
      </Typography>
      <LoginForm onSubmit={handleLogin} />
      <Snackbar
        open={!!state.errorMessage}
        autoHideDuration={6000}
        onClose={() => dispatch({ type: "SET_ERROR", error: "" })}
        message={state.errorMessage}
      />
    </Box>
  );
};

export default LoginPage;
