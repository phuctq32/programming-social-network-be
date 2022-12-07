import Category from '../models/category.js';

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        
        res.json({ categories });
    } catch (err) {
        next(err);
    }
}