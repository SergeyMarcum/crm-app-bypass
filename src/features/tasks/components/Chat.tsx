import React, { useState } from "react";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import { Send, PhotoCamera, AttachFile } from "@mui/icons-material";

interface Message {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  image?: string;
}

interface ChatProps {
  taskId: string;
}

export const Chat: React.FC<ChatProps> = ({ taskId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      author: { name: "Alcides Antonio", avatar: "/assets/avatar-1.png" },
      text: "I'm interested in your services, can you tell me more about your hourly rate?",
      timestamp: "4 days ago",
    },
    {
      id: "2",
      author: { name: "Sofia Rivers", avatar: "/assets/avatar-2.png" },
      text: "Sure, it is $50 per hour.",
      timestamp: "4 days ago",
    },
    {
      id: "3",
      author: { name: "Alcides Antonio", avatar: "/assets/avatar-1.png" },
      text: "Can't you make it $40? I'm on a tight budget.",
      timestamp: "3 days ago",
    },
    {
      id: "4",
      author: { name: "Sofia Rivers", avatar: "/assets/avatar-2.png" },
      text: "I'm sorry, I can't go lower than $45.",
      timestamp: "3 days ago",
    },
    {
      id: "5",
      author: { name: "Alcides Antonio", avatar: "/assets/avatar-1.png" },
      text: "Ok, I will think about it. Thanks!",
      timestamp: "2 days ago",
    },
    {
      id: "6",
      author: { name: "Alcides Antonio", avatar: "/assets/avatar-1.png" },
      image: "/assets/image-abstract-1.png",
      text: "",
      timestamp: "2 days ago",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: String(messages.length + 1),
          author: { name: "Current User", avatar: "/assets/avatar.png" },
          text: newMessage,
          timestamp: "Just now",
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0" }}>
      <Stack spacing={2}>
        {messages.map((message) => (
          <Stack
            key={message.id}
            direction={
              message.author.name === "Current User" ? "row-reverse" : "row"
            }
            spacing={2}
            alignItems="flex-start"
          >
            <Avatar src={message.author.avatar} />
            <Box>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor:
                    message.author.name === "Current User"
                      ? "primary.main"
                      : "background.paper",
                  color:
                    message.author.name === "Current User"
                      ? "white"
                      : "text.primary",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
                {message.image && (
                  <Box
                    component="img"
                    src={message.image}
                    alt="attachment"
                    sx={{ maxWidth: 200, mt: 1, borderRadius: 1 }}
                  />
                )}
              </Paper>
              <Typography variant="caption" color="text.secondary" mt={0.5}>
                {message.timestamp}
              </Typography>
            </Box>
          </Stack>
        ))}
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src="/assets/avatar.png" />
          <TextField
            fullWidth
            placeholder="Leave a message"
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <IconButton color="primary" onClick={handleSendMessage}>
            <Send />
          </IconButton>
          <IconButton>
            <PhotoCamera />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
};
