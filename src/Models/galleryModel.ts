import mongoose from "mongoose";

const Schema = mongoose.Schema;

const GallerySchema = new Schema({
    name: {
        required: true,
        type: String
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

export default mongoose.model("gallery", GallerySchema);