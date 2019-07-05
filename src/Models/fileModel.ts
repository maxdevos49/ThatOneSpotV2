import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FileSchema = new Schema({
    name: {//original file name. New file name will be db id.
        required: true,
        type: String
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    updatedOn: {
        type: Date
    },
});

export default mongoose.model("files", FileSchema);