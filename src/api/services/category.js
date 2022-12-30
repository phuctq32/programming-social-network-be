import Category from '../models/category.js';

const createCategory = async (name) => {
    try {
        const category = new Category({ name: name });
        await category.save();

        return category;
    } catch (err) {
        throw err;
    }
}

const getCategories = async () => {
    try {
        const categories = await Category.find();

        return categories;
    } catch (err) {
        throw err;
    }
}

const getCategoryById = async (id) => {
    try {
        const category = await Category.findById(id);
        if (!category) {
            const error = new Error('Category not found.');
            error.statusCode = 404;
            throw error;
        }

        return category;
    } catch (err) {
        throw err;
    }
}

export {
    createCategory,
    getCategories,
    getCategoryById
};