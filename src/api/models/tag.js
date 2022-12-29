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

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;