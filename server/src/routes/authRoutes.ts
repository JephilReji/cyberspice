import { Router } from "express";
import { sendOtp, register, login, googleLogin } from "../controllers/authController";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

export default router;
