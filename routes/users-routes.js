// perform callback functions for different routes
import express from 'express';

// callback functions stored in controllers folder
import { createUser } from '../controllers/users-controllers.js'

const router = express.Router();

router.post('/', createUser);

export default router;
