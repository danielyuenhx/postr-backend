import mongoose from 'mongoose';

// create user schema
const userSchema = mongoose.Schema({
	id: { type: String },
	username: { type: String, required: true },
	password: { type: String, required: true },
	notifications: { type: Boolean },
	createdAt: {
		type: Date,
		default: Date.now,
	},
	totalLikes: {
		type: Number,
		default: 0,
	},
	totalPosts: {
		type: Number,
		default: 0,
	},
	pinnedPost: { type: String, default: '' },
});

// schema -> model
const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;
