import { validationResult } from 'express-validator';
import Category from '../models/category.js';
import Post from '../models/post.js';
import Tag from '../models/tag.js';
import * as cloudinary from '../utils/cloudinary.js';

export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });

        res.status(200).json({ posts: posts });
    } catch (err) {
        next(err);
    }
}

export const createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        error.validationErrors = errors.array();
        return next(error);
    }
    
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

        let uploadedImages = [];
        if (files) {
            uploadedImages = await Promise.all(
                files.map(async (file, index) => {
                    const uploadedImage = await cloudinary.uploadImage(file.path, {
                        fileName: index.toString(),
                        folder: cloudinary.path.forPost(req.userId.toString()),
                    });
    
                    return uploadedImage.secure_url;
                }
            ));
        }

        const newPost = new Post({
            title,
            content,
            tag: tagId,
            category: categoryId,
            creator: req.userId,
            images: uploadedImages
        });
        await newPost.save();

        res.status(201).json({
            message: 'Created post succesfully.',
            post: newPost
        });
    } catch (err) {
        next(err);
    }
}