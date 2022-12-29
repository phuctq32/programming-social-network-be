import { validationResult } from 'express-validator';
import Category from '../models/category.js';
import Post from '../models/post.js';
import Tag from '../models/tag.js';
import User from '../models/user.js';
import * as imageHandler from '../utils/imageHandler.js';

export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });

        res.status(200).json({ posts: posts });
    } catch (err) {
        next(err);
    }
}

export const getPost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId)
            .populate('creator')
            .populate('tag')
            .populate('category');
        if (!post) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json(post);
    } catch (err) {
        next(err);
    }
}

export const createPost = async (req, res, next) => {
    const { title, content, tagId, categoryId } = req.body;
    const files = req.files;
    
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            const error = new Error('Category not found.');
            error.statusCode = 404;
            return next(error);
        }

        const tag = await Tag.findById(tagId);
        if (!tag) {
            const error = new Error('Tag not found.');
            error.statusCode = 404;
            return next(error);
        }

        const newPost = new Post({
            title,
            content,
            tag: tagId,
            category: categoryId,
            creator: req.userId
        });

        // upload images
        let uploadedImages = [];
        if (files) {
            uploadedImages = await Promise.all(
                files.map(async (file, index) => {
                    const uploadedImage = await imageHandler.uploadImage(file.path, {
                        fileName: index.toString(),
                        folder: imageHandler.path.forPost(req.userId.toString(), newPost._id.toString()),
                    });
    
                    return uploadedImage.url;
                }
            ));
        }
        newPost.images = uploadedImages;
    
        await newPost.save();

        res.status(201).json({
            message: 'Post created succesfully.',
            post: newPost
        });
    } catch (err) {
        next(err);
    }
}

export const editPost =  async (req, res, next) => {
    const postId = req.params.postId;
    const { title, content, tagId, categoryId } = req.body;
    const files = req.files;

    try {
        const editingPost = await Post.findById(postId)
            .populate('creator')
            .populate('tag')
            .populate('category');
        if (!editingPost) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            return next(error);
        }

        // Check if user is post's creator
        if (req.userId.toString() !== editingPost.creator._id.toString()) {
            const error = new Error('User is not the creator');
            error.statusCode = 403;
            return next(error);
        }

        // Check category and tag
        const category = await Category.findById(categoryId);
        if (!category) {
            const error = new Error('Category not found.');
            error.statusCode = 404;
            return next(error);
        }
        
        const tag = await Tag.findById(tagId);
        if (!tag) {
            const error = new Error('Tag not found.');
            error.statusCode = 404;
            return next(error);
        }

        // Delete old images
        if (editingPost.images.length > 0) {
            await imageHandler.deleteFolder(imageHandler.path.forPost(req.userId, editingPost._id.toString()));
        }
        
        let uploadedImages = [];
        if (files) {
            uploadedImages = await Promise.all(
                files.map(async (file, index) => {
                    const uploadedImage = await imageHandler.uploadImage(file.path, {
                        fileName: index.toString(),
                        folder: imageHandler.path.forPost(req.userId.toString(), editingPost._id.toString()),
                    });
                    
                    return uploadedImage.url;
                }
            ));
        }
            
        editingPost.title = title;
        editingPost.content = content;
        editingPost.tag = tagId;
        editingPost.category = categoryId;
        editingPost.images = uploadedImages;
        await editingPost.save();

        res.status(200).json(editingPost);
    } catch (err) {
        next(err);
    }
}

export const deletePost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            return next(error);
        }

        // Check if user is post's creator
        if (req.userId.toString() !== post.creator.toString()) {
            const error = new Error('User is not the creator');
            error.statusCode = 403;
            return next(error);
        }

        // Delete images
        if (post.images.length > 0) {
            await imageHandler.deleteFolder(imageHandler.path.forPost(req.userId, post._id.toString()));
        }

        // Delete post in savedPost of all users
        const allUsers = await User.find();
        for (const user of allUsers) {
            const updatedSavedPosts = user.savedPosts;
            if (updatedSavedPosts.includes(post._id)) {
                user.savedPosts = updatedSavedPosts.filter(p => p._id.toString() !== post._id.toString());
            }
            await user.save();
        }

        await Post.findByIdAndDelete(post._id);

        res.status(204).json();
    } catch (err) {
        next(err);
    }
}

export const like = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.userId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            return next(error);
        }

        const updatedLikes = post.likes;
        if (!updatedLikes.includes(userId)) {
            updatedLikes.push(userId);
            post.likes = updatedLikes;
            await post.save();
        }

        await post.populate('likes', 'name');


        res.status(200).json({ post: post, totalLikes: post.likes.length });
    } catch (err) {
        next(err);
    }
}

export const unlike = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.userId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            return next(error);
        }

        let updatedLikes = post.likes;
        if (updatedLikes.includes(userId)) {
            updatedLikes = updatedLikes.filter(like => like.toString() !== userId.toString());
            post.likes = updatedLikes;
            post.save();
        }

        await post.populate('likes', 'name');

        res.status(200).json({ post: post, totalLikes: post.likes.length });
    } catch (err) {
        next(err);
    }
}

export const view = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.userId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            return next(error);
        }

        const updatedViews = post.views;
        if (!updatedViews.includes(userId)) {
            updatedViews.push(userId);
            post.views = updatedViews;
            await post.save();
        }

        res.status(200).json({ post: post, totalViews: post.views.length });
    } catch (err) {
        next(err);
    }
}