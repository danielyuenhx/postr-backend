// perform callback functions for different routes
import express from 'express';

// callback functions stored in controllers folder
import { getPosts, createPost, deletePost, likePost } from '../controllers/posts-controllers.js';
import auth from '../middleware/auth.js'
import apiLimiter from '../middleware/rate-limiter.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', auth, apiLimiter, createPost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router;
