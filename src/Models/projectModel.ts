import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    projectType: {
        type: String,
        enum: ["External", "Internal"],
        default: "Internal",
        required: true 
    },
    isPublic: {
        type: Boolean,
        default: false
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
        type: String,
        required: true
    },
    updatedOn: {
        type: Date
    },
    updatedBy: {
        type: String,
    }
});

export default mongoose.model("project", ProjectSchema);