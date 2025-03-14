import bcrypt from "bcryptjs";
import UserRepository from "../infrastructure/repositories/userRepository";
import tokenService from "./tokenService";
import { User, IUser } from "../domain/User";
import axios from "axios";

const userService = {
  async register(userData: { name: string; email: string; password: string }) {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User(null, userData.name, userData.email, hashedPassword);
    return await UserRepository.save(user);
  },

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    if(user.userStatus === 'Blocked') throw new Error('User Blocked by admin')

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const userData = user as IUser;

    const accessToken = tokenService.generateToken(userData, "15m");
    const refreshToken = tokenService.generateToken(userData, "7d");

    return { user: userData, accessToken, refreshToken };
  },
  async getUserDetails(id: string) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return { userData: user };
  },
  async googleLogin(accessToken: string) {
    try {
      // Fetch user info from Google
      const { data: googleUser } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (!googleUser || !googleUser.email) {
        throw new Error("Invalid Google token");
      }
  
      // Check if user exists in the database
      let user = await UserRepository.findByEmail(googleUser.email);

      if(user?.userStatus === 'Blocked') throw new Error('User Blocked by admin')
  
      // Create a new user if not found
      if (!user) {
        user = await UserRepository.save({
          name: googleUser.name,
          email: googleUser.email,
          role: "user",
        } as User);
      }
  
      const userData = user as IUser;
  
      // Generate access & refresh tokens
      const newAccessToken = tokenService.generateToken(userData, "15m"); // Shorter TTL
      const newRefreshToken = tokenService.generateToken(userData, "7d"); // Longer TTL
  
      return { user: userData, accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error :any ) {

      throw new Error(error);
    }
  }
  
};

export default userService;
