import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
const router = express.Router();

console.log("userRoutes loaded");

router.post('/register', registerUser);
router.post('/login', loginUser);

// Debug test route
router.get('/test', (req, res) => res.send('User route works!'));

export default router;
