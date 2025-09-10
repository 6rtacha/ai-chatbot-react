import axios from "axios";
import { LoginInput, User, UserInput } from "../types/user";

const serverApi: string = `${process.env.REACT_APP_API_URL}`;
class UserService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async signup(input: UserInput): Promise<User> {
    try {
      const url = this.path + "/signup";
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("result:", result);

      const user: User = result.data;
      console.log("user:", user);
      localStorage.setItem("userData", JSON.stringify(user));

      return user;
    } catch (err) {
      console.log("Error signup", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<User> {
    try {
      const url = this.path + "/login";
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("login:", result);

      const user: User = result.data.user;
      console.log("user:", user);
      localStorage.setItem("userData", JSON.stringify(user));

      return user;
    } catch (err) {
      console.log("Error login", err);
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = this.path + "/logout";
      const result = await axios.post(url, {}, { withCredentials: true });
      console.log("logout:", result);

      localStorage.removeItem("userData");
    } catch (err) {
      console.log("Error logout", err);
      throw err;
    }
  }
}

export default UserService;
