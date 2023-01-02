import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

tagSchema.statics.getById = async (id) => {
    try {
        const tag = await Tag.findById(id);
        if (!tag) {
            const error = new Error('Tag not found.');
            error.statusCode = 404;
            throw error;
        }

        return tag;
    } catch (err) {
        throw err;
    }
}

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;