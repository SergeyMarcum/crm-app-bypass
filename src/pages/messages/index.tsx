import React, { useState } from "react";
import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  Grid,
  Paper,
  TextField,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Box,
  Fab,
  styled,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { useChatStore } from "../../entities/message/model";
import { Contact, Message } from "../../entities/message/types";

// Стилизованные компоненты для сообщений
const OutgoingMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: theme.spacing(2),
  "& .message": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 2),
    maxWidth: "70%",
  },
}));

const IncomingMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  marginBottom: theme.spacing(2),
  "& .message": {
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 2),
    maxWidth: "70%",
  },
}));

const MessagesPage: React.FC = () => {
  const {
    contacts,
    selectedContact,
    messages,
    setSelectedContact,
    addMessage,
  } = useChatStore();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "Вы",
      content: newMessage,
      timestamp: "Только что",
    };
    addMessage(message);
    setNewMessage("");
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Хлебные крошки */}
      <Typography variant="h3" gutterBottom>
        Чат
      </Typography>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Панель управления
        </Link>
        <Link underline="hover" color="inherit" href="/">
          Страницы
        </Link>
        <Typography color="text.primary">Чат</Typography>
      </Breadcrumbs>
      <Divider sx={{ my: 3 }} />

      {/* Основное содержимое */}
      <Paper elevation={1}>
        <Grid container>
          {/* Список контактов */}
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Box p={2}>
              <TextField
                fullWidth
                label="Поиск контактов"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Divider />
              <List>
                {contacts.map((contact) => (
                  <ListItemButton
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    selected={selectedContact?.id === contact.id}
                  >
                    <ListItemIcon>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        color={contact.isOnline ? "success" : "default"}
                      >
                        <Avatar src={contact.avatar} />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={contact.name}
                      secondary={contact.lastMessage}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Grid>

          {/* Окно чата */}
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            {selectedContact ? (
              <Box display="flex" flexDirection="column" height="100%">
                {/* Сообщения */}
                <Box flexGrow={1} p={3} sx={{ overflowY: "auto" }}>
                  {messages.map((message) =>
                    message.sender === "Вы" ? (
                      <OutgoingMessage key={message.id}>
                        <Box display="flex" alignItems="flex-end">
                          <Box className="message">{message.content}</Box>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            ml={1}
                          >
                            {message.timestamp}
                          </Typography>
                        </Box>
                      </OutgoingMessage>
                    ) : (
                      <IncomingMessage key={message.id}>
                        <Avatar src={selectedContact.avatar} sx={{ mr: 2 }} />
                        <Box display="flex" alignItems="flex-start">
                          <Box className="message">{message.content}</Box>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            ml={1}
                          >
                            {message.timestamp}
                          </Typography>
                        </Box>
                      </IncomingMessage>
                    )
                  )}
                </Box>

                {/* Поле ввода сообщения */}
                <Divider />
                <Grid container sx={{ p: 2 }} alignItems="center">
                  <Grid size={{ xs: 10 }}>
                    <TextField
                      fullWidth
                      label="Введите ваше сообщение"
                      variant="outlined"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <Box ml={2} display="flex" justifyContent="flex-end">
                      <Fab color="primary" onClick={handleSendMessage}>
                        <SendIcon />
                      </Fab>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box p={3}>
                <Typography variant="body1" color="textSecondary">
                  Выберите контакт, чтобы начать переписку.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MessagesPage;
