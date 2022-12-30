import Category from '../models/category.js';
import Tag from '../models/tag.js';

export const getTagsByCategoryId = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);
        if (!category) {
            const error = new Error('Category not found.');
            error.statusCode = 404;
            return next(error);
        }

        const tags = await Tag.find({ category: categoryId });

        res.status(200).json({
            tags,
            totalTags: tags.length
        });
    } catch (err) {
        next(err);
    }
}

export const createTag = async (req, res, next) => {
    const categoryId = req.body.categoryId;
    const tagName = req.body.name;
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            const error = new Error('Category not found.');
            error.statusCode = 404;
            return next(error);
        }

        // check if the tag is existing
        const existingTag = await Tag.findOne({
            category: categoryId,
            name: tagName
        });
        if (existingTag) {
            const error = new Error('Tag is existing.');
            error.statusCode = 409;
            return next(error);
        }

        const newTag = new Tag({
            name: tagName,
            category: categoryId
        });
        await newTag.save();

        res.status(201).json({
            message: 'Created tag successfully.'
        });
    } catch (err) {
        next(err);
    }
}