const mongoose = require('mongoose');

const PostModel = require('../models/posts-model.js');

// callback functions for routing
export const getPosts = async (req, res) => {
	try {
        const posts = await PostModel.find();
        res.status(200).json(posts);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createPost = async (req, res) => {
    // POST requests need access to request body
    const post = req.body;
    const newPost = new PostModel(post);

    try {
        // save to database
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
		res.status(404).json({ message: error.message });
    }
}
