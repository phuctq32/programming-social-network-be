import * as categoryService from '../services/category.js';

export const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getCategories();
        
        res.status(200).json({ categories });
    } catch (err) {
        next(err);
    }
}

export const createCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body.name);

        res.status(201).json({
            message: 'Created a category successfully',
            category
        });
    } catch (err) {
        next(err);
    }
}

export const editCategory = async (req, res, next) => {
    try {
        const category = await categoryService.editCategory(req.params.categoryId, req.body.name);

        res.status(200).json({ category });
    } catch (err) {
        next(err);
    }
}