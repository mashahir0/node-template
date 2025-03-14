import express from "express";
import userController from "../controllers/userController";
import { loginLimiter } from "../../infrastructure/middlewares/protectionMiddleware";
import { authorizeRoles, verifyToken } from "../../infrastructure/middlewares/authMiddleware";
const app = express()
const router = express.Router();
router.post("/refresh-token", userController.refreshToken);

router.post("/register", userController.register);
router.post("/login",loginLimiter,userController.login);

router.post("/auth/google", userController.googleAuth);

router.get(
  "/get-details",
  verifyToken(),
  authorizeRoles(["user", "admin"]),
  userController.getUserData
);





export default router;
