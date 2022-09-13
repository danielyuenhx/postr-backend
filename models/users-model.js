import mongoose from 'mongoose';

// create user schema
const userSchema = mongoose.Schema({
	id: { type: String },
	username: { type: String, required: true },
	password: { type: String, required: true },
    notifications: {type: Boolean },
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

// schema -> model
const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;
