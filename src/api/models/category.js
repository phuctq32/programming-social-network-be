import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

categorySchema.statics.getById = async (id) => {
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

const Category = mongoose.model('Category', categorySchema);
export default Category;