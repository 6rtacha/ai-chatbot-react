// HomePage.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Avatar,
  Stack,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Character } from "../types/character";
import CharacterService from "../services/CharacterService";

interface HomePageProps {
  user: {
    username: string;
    isLoggedIn: boolean;
  };
}

interface CreateCharacterForm {
  characterName: string;
  characterPrompt: string;
  characterImage: File | null;
}

const serverApi: string = `${process.env.REACT_APP_API_URL}`;

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("userData");
  let userData = null;
  if (userDataString) {
    userData = JSON.parse(userDataString);
  }

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<CreateCharacterForm>({
    characterName: "",
    characterPrompt: "",
    characterImage: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    handleCharacters();
  }, []);

  const handleCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const characterService = new CharacterService();
      const result: Character[] = await characterService.getCharacters();
      setCharacters(result);
    } catch (error) {
      console.log(error);
      setError("Please sign in or sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleCharacterSelect = (character: Character) => {
    // Navigate to chat page with character data in state
    navigate("/chat", {
      state: {
        characterId: character._id,
        characterName: character.characterName,
        characterImage: character.characterImage,
      },
    });
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setFormData({
      characterName: "",
      characterPrompt: "",
      characterImage: null,
    });
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        characterImage: file,
      }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCharacter = async () => {
    if (!formData.characterName || !formData.characterPrompt) {
      setError("Character name and prompt are required");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const characterService = new CharacterService();

      // Create FormData to send file and form data
      const formDataToSend = new FormData();
      formDataToSend.append("characterName", formData.characterName);
      formDataToSend.append("characterPrompt", formData.characterPrompt);
      if (formData.characterImage) {
        formDataToSend.append("characterImage", formData.characterImage);
      }

      await characterService.createCharacter(formDataToSend);

      // Refresh the characters list
      await handleCharacters();

      // Close the dialog and reset form
      handleCreateDialogClose();
    } catch (error) {
      console.log(error);
      setError("Failed to create character. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: "0 auto 2rem",
              background: "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
            }}
          >
            <ChatIcon sx={{ fontSize: 40 }} />
          </Avatar>

          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 3,
            }}
          >
            Welcome to ChatBot AI
          </Typography>

          {userData && (
            <Box
              sx={{
                mt: 6,
                p: 4,
                textAlign: "center",
                background: "linear-gradient(45deg, #f3e5f5 30%, #e3f2fd 90%)",
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" gutterBottom>
                {userData.userName}
              </Typography>
            </Box>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ justifyContent: "center", mt: 6 }}
          >
            {userData && (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleCreateDialogOpen}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                }}
              >
                Create Character
              </Button>
            )}

            {!userData && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<PersonIcon />}
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}
          </Stack>
        </Box>

        {/* Error Display */}
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Character Selection Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            Available Characters
          </Typography>

          {loading ? (
            <Typography variant="h6" align="center">
              Loading characters...
            </Typography>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {characters.map((character) => {
                const imagePath = character.characterImage
                  ? `http://localhost:3003${character.characterImage}`
                  : "/default-character.png";
                // console.log("imagePath", imagePath);
                return (
                  <Grid key={character._id} sx={{}}>
                    <Card
                      sx={{
                        position: "relative",
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          "& .character-image": {
                            borderColor: "#E50914",
                          },
                          "& .character-overlay": {
                            opacity: 1,
                          },
                        },
                      }}
                      // Change this in the character map
                      onClick={() => handleCharacterSelect(character)}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="240"
                          image={imagePath}
                          alt={character.characterName}
                          className="character-image"
                          sx={{
                            borderRadius: 1,
                            objectFit: "cover",
                            border: "2px solid transparent",
                            transition: "border-color 0.3s ease",
                          }}
                        />

                        {/* Hover Overlay */}
                        <Box
                          className="character-overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            display: "flex",
                            alignItems: "flex-end",
                            p: 2,
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "white",
                              fontSize: "0.9rem",
                              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                            }}
                          >
                            {character.characterPrompt}
                          </Typography>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 1, textAlign: "center" }}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.primary",
                            fontWeight: "500",
                            fontSize: "0.95rem",
                            mt: 1,
                          }}
                        >
                          {character.characterName}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Create Character Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Create New Character
          <IconButton
            aria-label="close"
            onClick={handleCreateDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Character Name"
              name="characterName"
              value={formData.characterName}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Character Prompt"
              name="characterPrompt"
              value={formData.characterPrompt}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              required
              helperText="Describe the character's personality and how they should respond"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="character-image">Character Image</InputLabel>
              <OutlinedInput
                id="character-image"
                type="file"
                inputProps={{ accept: "image/*" }}
                onChange={handleImageChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton component="span">
                      <CloudUploadIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "4px",
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button
            onClick={handleCreateCharacter}
            variant="contained"
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Character"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;
