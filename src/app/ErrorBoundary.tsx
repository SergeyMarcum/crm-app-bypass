import { Component, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h4" color="error" gutterBottom>
            Что-то пошло не так.
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Произошла ошибка. Пожалуйста, попробуйте перезагрузить страницу.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Перезагрузить
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
