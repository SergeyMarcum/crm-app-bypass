import {
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Modal,
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  Divider,
  // useTheme,
  //useMediaQuery,
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

export default function ToolbarActions() {
  const navigate = useNavigate();
  /*const theme = useTheme();
    const isSidebarCollapsed = useMediaQuery(theme.breakpoints.down("md"));
    const sidebarWidth = isSidebarCollapsed ? 56 : 240; // Исправляем ширину боковой панели (по умолчанию в DashboardLayout: 56px для свёрнутой, 240px для полной)*/

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const open = Boolean(anchorEl);

  const searchData = [
    {
      category: "Платформа",
      title:
        "Повысьте уровень поиска по вашему сайту с помощью нашего размещённого API",
      description:
        "Предоставьте своим пользователям контент, который им нужен, именно тогда, когда он им нужен, с помощью нашего поискового API на базе искусственного интеллекта.",
    },
    {
      category: "Платформа",
      title:
        "Создание эффективного масштабируемого поиска на торговой площадке",
      description:
        "Algolia — это API-интерфейс поиска как услуги, который помогает торговым площадкам создавать эффективные поисковые системы в больших масштабах, скольки при этом будет разработчик.",
    },
    {
      category: "Ресурсы",
      title:
        "Использование Netlify API для улучшения JavaScript-клиента Algolia",
      description:
        "Архитектура Algolia отличается высокой избыточностью, каждое приложение размещается на ...",
    },
    {
      category: "Ресурсы",
      title: "Повышение производительности",
      description:
        "Узнать тонкости создания высокопроизводительных приложений с помощью Algolia.",
    },
  ];

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

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const filteredData = searchData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          mx: 1,
          bgcolor: "grey.300",
          opacity: "25%",
          width: "2px",
          height: "24px",
          position: "absolute",
          left: "330px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <IconButton
        color="inherit"
        onClick={handleSearchOpen}
        sx={{
          position: "absolute",
          left: "350px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <MagnifyingGlass />
      </IconButton>

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
          bgcolor: "grey.300",
          width: "2px",
          height: "24px",
          alignSelf: "center",
        }}
      />

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

      <Modal open={searchOpen} onClose={handleSearchClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
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
                Платформа
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
              <LightbulbFilament color="orange" /> Советы: Введите поиск,
              введите ключевое слово и нажмите Enter
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
}
