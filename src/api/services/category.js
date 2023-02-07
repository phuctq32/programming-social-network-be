import Category from '../models/category.js';

const createCategory = async (name) => {
    try {
        if (await Category.exists({ name: name })) {
            const error = new Error('Category already exists!');
            error.statusCode = 409;
            throw error;
        }

        const category = new Category({ name: name });
        await category.save();

        return category;
    } catch (err) {
        throw err;
    }
}

const editCategory = async (categoryId, name) => {
    try {
        const category = await Category.getById(categoryId);
        if (await Category.findOne({ _id: { "$ne": category._id }, name: name })) {
            const error = new Error('Category already exists!');
            error.statusCode = 409;
            throw error;
        }

        category.name = name;
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

export {
    createCategory,
    editCategory,
    getCategories
};