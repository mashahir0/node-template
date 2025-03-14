import { Request, Response } from "express";
import UserRepository from "../../infrastructure/repositories/userRepository";
import adminServices from "../../usecases/adminService";
import tokenService from "../../usecases/tokenService";


const adminController = {
  async login(req: Request, res: Response) {
    try {
      const { admin, accessToken, refreshToken } = await adminServices.login(
        req.body.email,
        req.body.password
      );
      res.cookie("adminRefreshToken", refreshToken, {
        httpOnly: true,  
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict", 
        path: "/api/admin/refresh-token", 
      });
      res.status(200).json({ admin, accessToken });
    } catch (error: any) {
      console.log(error)
      res.status(400).json({ error: error.message });
    }
  },
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken)
        return res.status(401).json({ error: "No token provided" });

      const newToken = await tokenService.refreshToken(refreshToken);

      res.status(200).json(newToken);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  },
  async getUsers(req: Request, res: Response) {
    try {
      const users = await UserRepository.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  async blockUser(req: Request, res: Response) {
    try {
      const { id } = req.body;

      const result = await adminServices.blockUser(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const result = await adminServices.deleteUser(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default adminController;
