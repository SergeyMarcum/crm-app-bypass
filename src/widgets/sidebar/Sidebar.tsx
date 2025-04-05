import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import { ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NAVIGATION } from "../../shared/config/navigation";
import { useAuthStore } from "../../features/auth/store";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleNavigation = (segment: string) => {
    if (segment === "logout") {
      logout();
      navigate("/login", { replace: true }); // Перенаправляем с заменой истории
    } else {
      navigate(`/${segment}`);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <List>
          {NAVIGATION.map((item, index) => {
            if (item.kind === "header") {
              return (
                <ListItem key={index}>
                  <ListItemText primary={item.title} />
                </ListItem>
              );
            }
            if (item.kind === "divider") {
              return null;
            }
            if (item.segment) {
              return (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.segment)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              );
            }
            return null;
          })}
        </List>

        <Box sx={{ flexGrow: 1 }}>
          {NAVIGATION.map((item, index) =>
            item.kind === "divider" ? <Divider key={index} /> : null
          )}
        </Box>

        <List>
          {NAVIGATION.filter(
            (item) =>
              item.segment === "instructions" ||
              item.segment === "settings" ||
              item.segment === "help" ||
              item.segment === "logout"
          ).map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.segment!)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
