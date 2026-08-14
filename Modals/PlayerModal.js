import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        unique: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    profileImage: {
        type: String,
    },
    status: {
        type: String,
        enum: ["registered", "enrolled", "active", "inactive"],
        default: "registered"
    },
}, { timestamps: true });

const PlayerModel = mongoose.model("Player", PlayerSchema);
export default PlayerModel;
