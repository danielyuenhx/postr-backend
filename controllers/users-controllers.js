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
			{ expiresIn: '1h' }
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
			},
			token,
		});
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.' });
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

		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
};
