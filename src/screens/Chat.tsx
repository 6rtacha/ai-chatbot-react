// pages/ChatPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Chip,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

// ✅ import your service
import UserService from "../services/UserService";
import CharacterService from "../services/CharacterService";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface CharacterState {
  characterId: string;
  characterName: string;
  characterImage: string;
}

interface ChatPageProps {
  user: {
    username: string;
    isLoggedIn: boolean;
  };
}

const ChatPage: React.FC<ChatPageProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const characterState = location.state as CharacterState;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (characterState) {
        try {
          const character = new CharacterService();
          const { messages } = await character.getConversation(
            characterState.characterId
          );

          if (messages.length > 0) {
            // Map backend messages to your Message type
            setMessages(
              messages.map((msg: any, idx: number) => ({
                id: idx,
                text: msg.text,
                sender: msg.sender,
                timestamp: new Date(msg.timestamp),
              }))
            );
          } else {
            // no history → show welcome
            const welcomeMessage: Message = {
              id: Date.now(),
              text: `Hello${user.isLoggedIn ? ` ${user.username}` : ""}! I'm ${
                characterState.characterName
              }. How can I help you today?`,
              sender: "bot",
              timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
          }
        } catch (err) {
          console.error("Failed to fetch history:", err);
          setError("Could not load conversation history");
        }
      } else {
        setError("No character selected");
        setTimeout(() => navigate("/"), 2000);
      }
    };

    fetchHistory();
  }, [characterState, user.isLoggedIn, user.username, navigate]);

  useEffect(() => {
    if (characterState) {
      const welcomeMessage: Message = {
        id: Date.now(),
        text: `Hello${user.isLoggedIn ? ` ${user.username}` : ""}! I'm ${
          characterState.characterName
        }. How can I help you today?`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } else {
      setError("No character selected");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [characterState, user.isLoggedIn, user.username, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ use UserService instead of fetch
  const sendChatMessage = async (
    characterId: string,
    message: string
  ): Promise<string> => {
    const characterService = new CharacterService();
    const response = await characterService.chat(characterId, message);
    return response.reply; // backend sends { reply }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !characterState || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(
        characterState.characterId,
        userMessage.text
      );

      const botMessage: Message = {
        id: Date.now() + 1,
        text: reply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleCloseError = () => setError(null);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const goBackToHome = () => navigate("/");

  if (!characterState) {
    return (
      <Container maxWidth="md" sx={{ py: 2, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading character...
        </Typography>
      </Container>
    );
  }

  const imagePath = characterState.characterImage
    ? `http://localhost:3003${characterState.characterImage}`
    : "/default-character.png";

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Chat Interface */}
      <Paper sx={{ height: "80vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={goBackToHome} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar src={imagePath} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="h6">
                Chat with {characterState.characterName}
              </Typography>
              {user.isLoggedIn && (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Logged in as {user.username}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2, bgcolor: "#f5f5f5" }}>
          <Stack spacing={2}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                {message.sender === "bot" && (
                  <Avatar src={imagePath} sx={{ width: 32, height: 32 }} />
                )}

                <Box
                  sx={{
                    maxWidth: "70%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      message.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor:
                        message.sender === "user" ? "primary.main" : "white",
                      color:
                        message.sender === "user" ? "white" : "text.primary",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>

                {message.sender === "user" && (
                  <Avatar
                    sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}
                  >
                    {user.isLoggedIn
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </Avatar>
                )}
              </Box>
            ))}

            {isLoading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src={imagePath} sx={{ width: 32, height: 32 }} />
                <Chip
                  label="Typing..."
                  icon={<CircularProgress size={16} />}
                  sx={{ bgcolor: "white" }}
                />
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Stack>
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              sx={{ minWidth: "auto", px: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatPage;
