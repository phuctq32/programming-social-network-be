import Post from '../models/post.js';
import * as categoryService from '../services/category.js';
import * as tagService from '../services/tag.js';
import * as imageService from '../services/image.js';
import * as userService from '../services/user.js';
import * as imageHandler from '../utils/imageHandler.js';

const getPosts = async (filter) => {
    try {
        const posts = await Post.find()
            .populate('category')
            .populate('tag', 'name')
            .populate('creator', 'name')
            .sort({ createdAt: -1 });
        
        return posts;
    } catch (err) {
        throw err;
    }
}

const getPostById = async (id) => {
    try {
        const post = await Post.findById(postId)
            .populate('category')
            .populate('tag', 'name')
            .populate('creator', 'name');
        if (!post) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            throw error;
        }

        return post;
    } catch (err) {
        throw err;
    }
}

const createPost = async ({ title, content, tagId, categoryId, userId, files }) => {
    try {
        const category = await categoryService.getCategoryById(categoryId);
        const tag = await tagService.getTagById(tagId);

        const post = new Post({
            title,
            content,
            tag: tag._id,
            category: category._id,
            creator: userId
        });

        // upload images
        const uploadedImages = await imageService.uploadMultipleFiles(files);
        post.images = uploadedImages;
    
        await post.save();

        return post;
    } catch (err) {
        throw err;
    }
}

const updatePost = async ({ postId, title, content, tagId, categoryId, files }) => {
    try {
        const editedPost = await getPostById(postId);

        // Check if user is post's creator
        if (userId.toString() !== editedPost.creator._id.toString()) {
            const error = new Error('User is not the creator');
            error.statusCode = 403;
            throw error;
        }

        // Check category and tag are existing
        const category = await categoryService.getCategoryById(categoryId);
        const tag = await tagService.getTagById(tagId);

        // Delete old images
        if (editedPost.images.length > 0) {
            await imageHandler.deleteFolder(imageHandler.path.forPost(req.userId, editedPost._id.toString()));
        }
        
        const uploadedImages = await imageService.uploadMultipleFiles(files);
            
        editedPost.title = title;
        editedPost.content = content;
        editedPost.tag = tag._id;
        editedPost.category = category._id;
        editedPost.images = uploadedImages;
        await editedPost.save();

        return editedPost;
    } catch (err) {
        throw err;
    }
}

const deleteSavedPost = async (postId, userId) => {
    try {
        const user = await userService.getUserById(userId);
        const post = await getPostById(postId);
        const updatedSavedPosts = user.savedPosts;
            if (updatedSavedPosts.includes(post._id)) {
                user.savedPosts = updatedSavedPosts.filter(p => p._id.toString() !== post._id.toString());
            }
        await user.save();
    } catch (err) {

    }
}

const deletePost = async (postId, userId) => {
    try {
        const post = await getPostById(postId);

        // Check if user is post's creator
        if (userId.toString() !== post.creator.toString()) {
            const error = new Error('User is not the creator');
            error.statusCode = 403;
            throw error;
        }

        // Delete images
        if (post.images.length > 0) {
            await imageHandler.deleteFolder(imageHandler.path.forPost(userId, post._id.toString()));
        }

        // Delete post in savedPost of all users
        const allUsers = await userService.getUsers();
        for (const user of allUsers) {
            await deleteSavedPost(postId, user._id.toString());
        }

        await Post.findByIdAndDelete(post._id);
    } catch (err) {
        throw err;
    }
}

const likePost = async (postId, userId) => {
    try {
        const post = await getPostById(postId);

        const updatedLikes = post.likes;
        if (!updatedLikes.includes(userId)) {
            updatedLikes.push(userId);
            post.likes = updatedLikes;
            await post.save();
        }

        await post.populate('likes', 'name');

        return post;
    } catch (err) {
        throw err;
    }
}

const unlikePost = async (postId, userId) => {
    try {
        const post = await getPostById(postId);

        const updatedLikes = post.likes;
        if (updatedLikes.includes(userId)) {
            updatedLikes = updatedLikes.filter(like => like.toString() !== userId.toString());
            post.likes = updatedLikes;
            await post.save();
        }

        await post.populate('likes', 'name');

        return post;
    } catch (err) {
        throw err;
    }
}

const viewPost = async (postId, userId) => {
    try {
        const post = await getPostById(postId);

        const updatedViews = post.Views;
        if (!updatedViews.includes(userId)) {
            updatedViews.push(userId);
            post.views = updatedViews;
            await post.save();
        }

        return post;
    } catch (err) {
        throw err;
    }
}

export {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    viewPost,
};