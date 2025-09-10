import axios from "axios";
import { Character } from "../types/character";

const serverApi: string = `${process.env.REACT_APP_API_URL}`;

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue || null;
  }
  return null;
};

class CharacterService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getCharacters(): Promise<Character[]> {
    try {
      const url = `${this.path}/getCharacters`;

      const response = await axios.get(url, {
        withCredentials: true,
      });

      console.log("getCharacters response", response);
      return response.data;
    } catch (err) {
      console.log("Error getCharacters", err);
      throw err;
    }
  }

  public async createCharacter(formData: FormData): Promise<Character> {
    try {
      const url = `${this.path}/createCharacter`;

      const response = await axios.post(url, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("createCharacter response", response);
      return response.data;
    } catch (err) {
      console.log("Error createCharacter", err);
      throw err;
    }
  }

  public async chat(
    characterId: string,
    message: string
  ): Promise<{ reply: string }> {
    try {
      const url = `${this.path}/chat`;

      const response = await axios.post(
        url,
        { characterId, message }, // body
        { withCredentials: true }
      );

      console.log("chat response", response.data);
      return response.data; // should contain { reply }
    } catch (err) {
      console.log("Error chat", err);
      throw err;
    }
  }

  public async getConversation(
    characterId: string
  ): Promise<{ messages: any[] }> {
    const url = `${this.path}/conversation/${characterId}`;
    const response = await axios.get(url, { withCredentials: true });
    return response.data;
  }
}

export default CharacterService;
