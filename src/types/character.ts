export interface CharacterInput {
  characterName: string;
  characterPrompt: string;
  characterImage?: string;
  userId?: string;
}

export interface Character {
  _id: string;
  characterName: string;
  characterPrompt: string;
  characterImage?: string;
  userId: string;
}
