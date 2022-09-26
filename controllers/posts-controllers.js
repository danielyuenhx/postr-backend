import mongoose from 'mongoose';

import PostModel from '../models/posts-model.js';

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
};

export const deletePost = async (req, res) => {
	const { id } = req.params;

	// check if Post with ID exists
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send('No post with that ID.');

	try {
		// find and delete
		await PostModel.findByIdAndRemove(id);
		res.status(200).json({ message: 'Post deleted successfully.' });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const likePost = async (req, res) => {
	const { id } = req.params;

	// check if Post with ID exists
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send('No post with that ID.');

	try {
		// find and delete
		const post = await PostModel.findById(id);
		const updatedPost = await PostModel.findByIdAndUpdate(
			id,
			{ likeCount: post.likeCount + 1 },
			{ new: true }
		);

		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
