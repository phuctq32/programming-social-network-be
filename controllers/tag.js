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

        const tags = await Tag.find({ category: categoryId});

        res.status(200).json({
            tags,
            totalTags: tags.length
        });
    } catch (err) {
        next(err);
    }
}