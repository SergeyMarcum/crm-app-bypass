// src/pages/ErrorPage.tsx
import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { useRouteError, useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h5" color="error">
        Произошла ошибка
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {error?.message || "Неизвестная ошибка"}
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
        Вернуться на главную
      </Button>
    </Box>
  );
};

export default ErrorPage;
