// perform callback functions for different routes
import express from 'express';

// callback functions stored in controllers folder
import { getPosts, createPost, deletePost } from '../controllers/posts-controllers.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', createPost);
router.delete('/:id', deletePost);

export default router;
