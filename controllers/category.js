import { validationResult } from 'express-validator';
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }

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