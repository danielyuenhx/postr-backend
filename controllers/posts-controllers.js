const mongoose = require('mongoose');

const PostModel = require('../models/posts-model.js');

// callback functions for routing
export const getPosts = async (req, res) => {
	try {
	} catch (error) {
		// response during error
		res.status(404).json({ message: error.message });
	}
};
