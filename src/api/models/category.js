import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

categorySchema.statics.create = async function({ name }) {
    try {
        console.log("da do");
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

const Category = mongoose.model('Category', categorySchema);


export default Category;