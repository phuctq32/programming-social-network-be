import * as tagService from '../services/tag.js';

export const getTagsByCategoryId = async (req, res, next) => {
    try {
        const tags = await tagService.getTagsByCategoryId(req.params.categoryId);

        res.status(200).json({
            tags,
            totalTags: tags.length
        });
    } catch (err) {
        next(err);
    }
}

export const createTag = async (req, res, next) => {
    try {
        const tag = await tagService.createTag(req.body.name, req.body.categoryId);

        res.status(201).json({
            message: 'Created tag successfully.',
            tag
        });
    } catch (err) {
        next(err);
    }
}