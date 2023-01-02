import * as postService from '../services/post.js';

export const getPosts = async (req, res, next) => {
    try {
        const posts = await postService.getPosts();

        res.status(200).json({ posts });
    } catch (err) {
        next(err);
    }
}

export const getPost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await postService.getPost(postId);

        res.status(200).json(post);
    } catch (err) {
        next(err);
    }
}

export const createPost = async (req, res, next) => {
    const postData = {
        title: req.body.title,
        content: req.body.content,
        categoryId: req.body.categoryId,
        tagId: req.body.tagId,
        userId: req.body.userId,
        files: req.files
    };
    
    try {
        const post = await postService.createPost(postData);

        res.status(201).json({ message: 'Post created succesfully.', post });
    } catch (err) {
        next(err);
    }
}

export const editPost =  async (req, res, next) => {
    const postData = {
        postId: req.params.postId,
        title: req.body.title,
        content: req.body.content,
        categoryId: req.body.categoryId,
        tagId: req.body.tagId,
        userId: req.body.userId,
        files: req.files
    };

    try {
        const editingPost = await postService.updatePost(postData);

        res.status(200).json(editingPost);
    } catch (err) {
        next(err);
    }
}

export const deletePost = async (req, res, next) => {
    try {
        await postService.deletePost(req.params.postId, req.userId);

        res.status(204).json();
    } catch (err) {
        next(err);
    }
}

export const like = async (req, res, next) => {
    try {
        const updatedPost = await postService.likePost(req.params.postId, req.userId);

        res.status(200).json({ updatedPost });
    } catch (err) {
        next(err);
    }
}

export const unlike = async (req, res, next) => {
    try {
        const updatedPost = await postService.likePost(req.params.postId, req.userId);

        res.status(200).json({ updatedPost });
    } catch (err) {
        next(err);
    }
}

export const view = async (req, res, next) => {
    try {
        const updatedPost = await postService.likePost(req.params.postId, req.userId);

        res.status(200).json({ updatedPost });
    } catch (err) {
        next(err);
    }
}