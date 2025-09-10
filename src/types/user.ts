export interface User {
  _id: string;
  userName: string;
  userPassword: string;
  userImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  userName: string;
  userPassword: string;
  userImage?: string;
}

export interface LoginInput {
  userName: string;
  userPassword: string;
}
