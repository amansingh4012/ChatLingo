import express from 'express';
import { signup, login, logout, onboard } from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post("/onboarding", protectRoute, onboard);

router.get('/protected', protectRoute, (req, res) => {
    res.status(200).json({ message: "You have accessed a protected route", user: req.user });
});

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
