import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../models/users-model.js';
import PostModel from '../models/posts-model.js';
import { getPosts } from './posts-controllers.js';

// callback functions for routing
export const createUser = async (req, res) => {
	// POST requests need access to request body
	const { username, password, confirmPassword } = req.body;

	try {
		// check username length
		if (username.length > 15) return res.status(400).json({ message: 'Username must be less than or equal to 15 characters!' })

		// check if user already exists
		const existingUser = await UserModel.findOne({ username });
		if (existingUser)
			return res.status(400).json({ message: 'User already exists.' });

		// check if passwords are matching
		if (password !== confirmPassword)
			return res.status(400).json({ message: 'Passwords do not match.' });

		const hashedPassword = await bcrypt.hash(password, 12);

		// save to database
		const newUser = await UserModel.create({
			username,
			password: hashedPassword,
			notifications: true,
		});

		const token = jwt.sign(
			{ username: newUser.username, id: newUser._id },
			'test',
			{ expiresIn: '24h' }
		);

		res.status(200).json({
			result: {
				username: newUser.username,
				notifications: newUser.notifications,
			},
			token,
		});
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export const loginUser = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await UserModel.findOne({ username });
		if (!user)
			return res.status(404).json({ message: 'User does not exist!' });

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect)
			return res.status(400).json({ message: 'Invalid credentials.' });

		// need to have secret string stored in env file
		const token = jwt.sign(
			{ username: user.username, id: user._id },
			'test',
			{ expiresIn: '1h' }
		);

		res.status(200).json({
			result: {
				username,
				id: user._id,
				createdAt: user.createdAt,
				notifications: user.notifications,
				pinnedPost: user.pinnedPost,
				picture: user.picture,
			},
			token,
		});
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export const deleteUser = async(req, res) => {
	const { id } = req.params;

	if (!req.userId) return res.json({ message: 'Unauthenticated!' });

	// check if User with username exists
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send('No user with that username.');

	try {
		// find and delete
		const deletedUser = await UserModel.findByIdAndRemove(id);

		res.status(200).json({ message: 'User deleted successfully.' });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getUser = async (req, res) => {
	const { username } = req.params;

	try {
		// const posts = await PostModel.find();

		// let totalLikes = 0;
		// for (let i = 0; i < posts.length; i++) {
		// 	totalLikes += posts[i].likes.length;
		// }

		const user = await UserModel.findOne({ username });
		if (!user)
			return res.status(404).json({ message: 'User does not exist!' });

		res.status(200).json({
			username,
			createdAt: user.createdAt,
			totalLikes: user.totalLikes,
			totalPosts: user.totalPosts,
			pinnedPost: user.pinnedPost,
			picture: user.picture,
		});
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export const updatePicture = async (req, res) => {
	const userId = req.body.userId;
	const image = req.body.image;

	if (!userId) return res.json({ message: 'Unauthenticated!' });

	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ picture: image },
			{ new: true }
		);

		res.status(200).json({
			result: {
				username: updatedUser.username,
				id: updatedUser._id,
				createdAt: updatedUser.createdAt,
				notifications: updatedUser.notifications,
				pinnedPost: updatedUser.pinnedPost,
				picture: updatedUser.picture,
			}
		});
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export const pinPost = async (req, res) => {
	const userId = req.body.userId;
	const postId = req.body.postId;
	
	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ pinnedPost: postId },
			{ new: true }
		);

		res.status(200).json({
			result: {
				username: updatedUser.username,
				id: updatedUser._id,
				createdAt: updatedUser.createdAt,
				notifications: updatedUser.notifications,
				pinnedPost: updatedUser.pinnedPost,
				picture: updatedUser.picture,
			}
		});
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
};
