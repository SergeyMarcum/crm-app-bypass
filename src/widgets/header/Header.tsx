import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import { Bell, Gear, Path, SignOut } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    navigate("/login");
    handleClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: 1201,
        backgroundColor: "#1976D2", // Тёмный фон, как в примере
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)", // Тень elevation={4}
        color: "#ffffff", // Белый цвет текста и иконок
      }}
    >
      <Toolbar sx={{ padding: "0 24px", minHeight: 64 }}>
        <IconButton color="inherit" onClick={() => navigate("/")}>
          <Path />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontSize: "1.5rem", // Размер шрифта, как в примере
            fontWeight: 500, // Средний вес шрифта
            color: "#ffffff", // Белый цвет
            marginLeft: "10px", // Отступ от иконки
          }}
        >
          Обходчик
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            <Bell />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={() => navigate("/settings")}>
          <Gear />
        </IconButton>
        <IconButton onClick={handleMenu}>
          <Avatar sx={{ ml: 2 }}>U</Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleClose}>
            Иван Иванов (ivan@example.com)
          </MenuItem>
          <MenuItem onClick={() => navigate("/settings")}>Профиль</MenuItem>
          <MenuItem onClick={handleSignOut}>
            <SignOut style={{ marginRight: 8 }} /> Выход
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
