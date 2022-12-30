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
        return await Category.find();
    } catch (err) {
        throw err;
    }
}

export {
    createCategory,
    getCategories
};