import mongoose from 'mongoose';

import PostModel from '../models/posts-model.js';
import UserModel from '../models/users-model.js';

// callback functions for routing
export const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.aggregate([
      {
        $lookup: {
          from: 'usermodels',
          localField: 'user',
          foreignField: 'username',
          as: 'userDetails',
        },
      },
    ]);
    const returnedPosts = posts.map((post) => {
      return {
        _id: post._id,
        content: post.content,
        createdAt: post.createdAt,
        likes: post.likes,
        selectedFile: post.selectedFile,
        title: post.title,
        user: post.user,
        picture: post.userDetails[0].picture,
        pinnedPost: post.pinnedPost,
      };
    });
    res.status(200).json(returnedPosts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  // POST requests need access to request body
  const post = req.body;

  // ensure that the post is created by the logged in person
  if (req.username !== post.user)
    return res.status(404).json({ message: 'Unauthenticated!' });

  // ensure file uploaded is an image
  if (!post.selectedFile.startsWith('data:image') && post.selectedFile !== '')
    return res.status(404).json({ message: 'File uploaded is not an image.' });

  const newPost = new PostModel(post);

  try {
    // save to database
    await newPost.save();

    const user = await UserModel.findById(req.userId);
    await UserModel.findByIdAndUpdate(
      req.userId,
      { totalPosts: user.totalPosts + 1 },
      { new: true }
    );

    res.status(200).json(newPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findById(req.userId);
  const post = await PostModel.findById(id);

  if (user._id !== post._id) return res.json({ message: 'Unauthenticated!' });

  // check if Post with ID exists
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No post with that ID.');

  try {
    // find and delete
    const deletedPost = await PostModel.findByIdAndRemove(id);

    await UserModel.findByIdAndUpdate(
      req.userId,
      {
        totalPosts: user.totalPosts - 1,
        totalLikes: user.totalLikes - deletedPost.likes.length,
      },
      { new: true }
    );

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

    const user = await UserModel.findOne({ username: post.user });

    // if not liked, like post
    if (index === -1) {
      post.likes.push(req.userId);

      await UserModel.findByIdAndUpdate(
        user._id,
        { totalLikes: user.totalLikes + 1 },
        { new: true }
      );
    }
    // if liked, dislike post
    else {
      post.likes = post.likes.filter((id) => id != String(req.userId));

      await UserModel.findByIdAndUpdate(
        user._id,
        { totalLikes: user.totalLikes - 1 },
        { new: true }
      );
    }

    const updatedPost = await PostModel.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
