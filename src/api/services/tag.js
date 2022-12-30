import Tag from '../models/tag.js';
import * as categoryService from '../services/category.js';

const getTagById = async (id) => {
    try {
        const tag = await Tag.findById(id);
        if (!tag) {
            const error = new Error('Tag not found.');
            error.statusCode = 404;
            throw error;
        }

        return tag;
    } catch (err) {
        throw err;
    }
}

const getTagsByCategoryId = async (categoryId) => {
    try {
        const category = await categoryService.getCategoryById(categoryId);

        const tags = await Tag.find({ category: category });

        return tags;
    } catch (err) {
        throw err;
    }
}

const createTag = async (name, categoryId) => {
    try {
        const category = await categoryService.getCategoryById(categoryId);

        // check if the tag is existing
        const existingTag = await Tag.findOne({
            category: categoryId,
            name
        });
        if (existingTag) {
            const error = new Error('Tag is existing.');
            error.statusCode = 409;
            throw error;
        }

        const tag = new Tag({
            name: tagName,
            category: categoryId
        });
        await tag.save();

        return tag;
    } catch (err) {
        next(err);
    }
}

export {
    getTagById,
    getTagsByCategoryId,
    createTag
};