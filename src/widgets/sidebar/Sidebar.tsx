import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { House, Calendar, Gear } from "@phosphor-icons/react";

export default function Sidebar() {
  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <List>
        <ListItem>
          <ListItemIcon>
            <House />
          </ListItemIcon>
          <ListItemText primary="Главная" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Calendar />
          </ListItemIcon>
          <ListItemText primary="Календарь" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Gear />
          </ListItemIcon>
          <ListItemText primary="Настройки" />
        </ListItem>
      </List>
    </Drawer>
  );
}
