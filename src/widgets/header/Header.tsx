import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Bell,
  Gear,
  SignOut,
  MagnifyingGlass,
  LightbulbFilament,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

export default function Header() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const searchData = [
    {
      category: "Платформа",
      title: "Создание API для поиска по сайту",
      description:
        "Мощный API, который помогает пользователям находить нужный контент быстрее.",
    },
    {
      category: "Ресурсы",
      title: "Увеличение производительности интерфейса",
      description: "Как оптимизировать загрузку компонентов с помощью React.",
    },
  ];

  const filteredData = searchData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "64px",
        position: "relative",
        px: 3,
      }}
    >
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          mx: 1,
          bgcolor: theme.palette.divider,
          opacity: 0.25,
          width: "2px",
          height: "24px",
          position: "absolute",
          left: theme.spacing(43.75),
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <IconButton
        color="inherit"
        onClick={handleSearchOpen}
        sx={{
          position: "absolute",
          left: theme.spacing(46.875),
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <MagnifyingGlass />
      </IconButton>

      <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
        <IconButton color="inherit" sx={{ mr: 1 }}>
          <Badge badgeContent={3} color="error">
            <Bell />
          </Badge>
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => navigate("/settings")}
          sx={{ mr: 1 }}
        >
          <Gear />
        </IconButton>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 1,
            bgcolor: theme.palette.divider,
            width: "2px",
            height: "24px",
            alignSelf: "center",
          }}
        />

        <IconButton onClick={handleMenu}>
          <Avatar sx={{ ml: 2 }}>
            {user?.full_name?.charAt(0).toUpperCase() || "U"}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleClose}>
            {user?.full_name} ({user?.email || "Нет email"})
          </MenuItem>
          <MenuItem onClick={() => navigate("/settings")}>Профиль</MenuItem>
          <MenuItem onClick={handleLogout}>
            <SignOut style={{ marginRight: 8 }} /> Выйти
          </MenuItem>
        </Menu>
      </Box>

      <Modal open={searchOpen} onClose={handleSearchClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[4],
            p: theme.spacing(4),
            borderRadius: theme.shape.borderRadius,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Поиск</Typography>
            <IconButton onClick={handleSearchClose}>
              <X />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <MagnifyingGlass style={{ marginRight: 8, color: "gray" }} />
              ),
            }}
          />
          {searchQuery ? (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Результаты
              </Typography>
              <List>
                {filteredData.map((item, index) => (
                  <ListItem key={index} sx={{ display: "block" }}>
                    <Typography variant="body2" color="primary">
                      {item.category}
                    </Typography>
                    <Typography variant="subtitle2">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              <LightbulbFilament color="orange" /> Введите ключевое слово и
              нажмите Enter
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
