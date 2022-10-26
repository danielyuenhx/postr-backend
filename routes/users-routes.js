// perform callback functions for different routes
import express from 'express';

// callback functions stored in controllers folder
import { createUser, getUser, loginUser, pinPost } from '../controllers/users-controllers.js'

const router = express.Router();

router.post('/createUser', createUser);
router.post('/loginUser', loginUser);
router.get('/:username', getUser)
router.post('/pinPost', pinPost)

export default router;
