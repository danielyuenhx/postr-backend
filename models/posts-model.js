import mongoose from 'mongoose';

// create post schema
const postSchema = mongoose.Schema({
	user: String,
    title: String,
	content: String,
	tags: [String],
    selectedFile: String,
	likes: {
		type: [String],
		default: [],
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

// schema -> model
const PostModel = mongoose.model('PostModel', postSchema);

export default PostModel;
