import mongoose from "mongoose";

// create user schema
const userSchema = mongoose.Schema({
	username: String,
	password: String,
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

// schema -> model
const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;
