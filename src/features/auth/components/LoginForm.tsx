// src/features/auth/LoginForm.tsx
import React, { useEffect, useReducer } from "react";
import {
  Box, // Добавляем импорт Box
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { fetchDomains, fetchDomainsTest } from "../api";

export interface LoginFormData {
  domain: string;
  username: string;
  password: string;
  rememberMe: boolean;
  testMode: boolean;
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
}

const initialState = {
  domain: "",
  username: "",
  password: "",
  rememberMe: false,
  testMode: localStorage.getItem("apiMode") === "test",
  showPassword: false,
  domains: {} as Record<string, string>,
  loading: false,
  error: null as string | null,
};

type Action =
  | { type: "SET_FIELD"; field: string; value: string | boolean }
  | { type: "SET_DOMAINS"; domains: Record<string, string> }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_LOADING"; loading: boolean };

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_DOMAINS":
      return {
        ...state,
        domains: action.domains,
        domain: state.domain || Object.keys(action.domains)[0] || "",
      };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadDomains = async () => {
      dispatch({ type: "SET_LOADING", loading: true });
      try {
        const data = state.testMode
          ? await fetchDomainsTest()
          : await fetchDomains();
        dispatch({ type: "SET_DOMAINS", domains: data });
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          error: `Ошибка загрузки доменов: ${err instanceof Error ? err.message : "Неизвестная ошибка"}`,
        });
      } finally {
        dispatch({ type: "SET_LOADING", loading: false });
      }
    };
    loadDomains();
  }, [state.testMode]);

  const handleChange = (field: string, value: string | boolean) => {
    dispatch({ type: "SET_FIELD", field, value });
    if (field === "testMode") {
      localStorage.setItem("apiMode", value ? "test" : "real");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", loading: true });
    dispatch({ type: "SET_ERROR", error: null });

    const formData: LoginFormData = {
      domain: state.domain,
      username: state.username,
      password: state.password,
      rememberMe: state.rememberMe,
      testMode: state.testMode,
    };

    if (onSubmit) {
      onSubmit(formData);
    }
    dispatch({ type: "SET_LOADING", loading: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal" disabled={state.loading}>
        <InputLabel id="domain-label">Домен</InputLabel>
        {state.loading ? (
          <Box display="flex" justifyContent="center" padding={1}>
            <CircularProgress size={24} />
          </Box>
        ) : Object.keys(state.domains).length === 0 ? (
          <Typography color="error">
            Не удалось загрузить список доменов
          </Typography>
        ) : (
          <Select
            labelId="domain-label"
            value={state.domain}
            onChange={(e) => handleChange("domain", e.target.value)}
            label="Домен"
          >
            {Object.entries(state.domains).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>

      {state.error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {state.error}
        </Typography>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Логин"
        value={state.username}
        onChange={(e) => handleChange("username", e.target.value)}
        disabled={state.loading}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Пароль"
        type={state.showPassword ? "text" : "password"}
        value={state.password}
        onChange={(e) => handleChange("password", e.target.value)}
        disabled={state.loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  handleChange("showPassword", !state.showPassword)
                }
                edge="end"
              >
                {state.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={state.rememberMe}
            onChange={(e) => handleChange("rememberMe", e.target.checked)}
          />
        }
        label="Запомнить меня"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={state.testMode}
            onChange={(e) => handleChange("testMode", e.target.checked)}
          />
        }
        label="Для тестирования"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={
          state.loading || !state.domain || !state.username || !state.password
        }
      >
        {state.loading ? <CircularProgress size={24} /> : "Войти"}
      </Button>
    </form>
  );
};

export default LoginForm;
