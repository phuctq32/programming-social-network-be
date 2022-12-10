import Post from '../models/post.js';

export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });

        res.status(200).json({ posts: posts });
    } catch (err) {
        next(err);
    }
}