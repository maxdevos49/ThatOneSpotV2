import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    url: {
        required: true,
        type: String,
    },
    description: {
        type: String,
    },
    imageUrl: {
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
    createdBy: {
        required: true,
        type: String
    },
    updatedOn: {
        type: Date
    },
    updatedBy: {
        type: String,
    }
});

export default mongoose.model("project", ProjectSchema);