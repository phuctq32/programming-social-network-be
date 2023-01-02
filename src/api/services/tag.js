import Category from '../models/category.js';
import Tag from '../models/tag.js';

const getTagsByCategoryId = async (categoryId) => {
    try {
        const category = await Category.getById(categoryId);

        const tags = await Tag.find({ category: category });

        return tags;
    } catch (err) {
        throw err;
    }
}

const createTag = async (name, categoryId) => {
    try {
        Category.getById(categoryId);

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
    getTagsByCategoryId,
    createTag
};