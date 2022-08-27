const mongoose = require('mongoose');

// create post schema
const postSchema = mongoose.Schema({
	user: String,
	content: String,
	tags: [String],
	likeCount: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

// schema -> model
const PostModel = mongoose.model('PostModel', postSchema);

export default PostModel;
