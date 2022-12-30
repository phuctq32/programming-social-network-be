import Category from '../models/category.js';

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        
        res.json({ categories });
    } catch (err) {
        next(err);
    }
}

export const createCategory = async (req, res, next) => {
    const name = req.body.name;
    try {
        const category = new Category({ name: name });
        await category.save();

        res.status(201).json({
            message: 'Created a category successfully',
            category
        });
    } catch (err) {
        next(err);
    }
}