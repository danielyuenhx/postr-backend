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

    // ensure that the post is created by the logged in person
	if (req.username !== post.user) return res.status(404).json({ message: 'Unauthenticated!' });

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

	if (!req.userId) return res.json({ message: 'Unauthenticated!' });
    // ensure that the post is deleted by the logged in person
	if (req.username !== post.user) return res.status(404).json({ message: 'Unauthenticated!' });

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

	if (!req.userId) return res.json({ message: 'Unauthenticated!' });

	// check if Post with ID exists
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send('No post with that ID.');

	try {
		// find post
		const post = await PostModel.findById(id);
		// find if the user has liked this specific post
		const index = post.likes.findIndex((id) => id === String(req.userId));

		// if not liked, like post
		if (index === -1) {
			post.likes.push(req.userId);
		}
		// if liked, dislike post
		else {
			post.likes = post.likes.filter((id) => id != String(req.userId));
		}

		const updatedPost = await PostModel.findByIdAndUpdate(
			id,
			post,
			{ new: true }
		);

		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
