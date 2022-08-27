// perform callback functions for different routes
const express = require('express');

// callback functions stored in controllers folder
const { getPosts } = require('../controllers/posts-controllers.js');

const router = express.Router();

router.get('/', getPosts);

export default router;
