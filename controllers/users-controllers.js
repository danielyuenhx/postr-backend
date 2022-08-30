import mongoose from 'mongoose'

import UserModel from '../models/users-model.js';

// callback functions for routing
export const createUser = async (req, res) => {
	// POST requests need access to request body
	const user = req.body;
	const newUser = new UserModel(user);

	try {
		// save to database
		await newUser.save();
		res.status(200).json(newUser);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
