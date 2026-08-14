import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    format: {
        type: String,
        enum: ["stroke", "match", "stableford"],
        default: "stroke"
    },
    status: {
        type: String,
        enum: ["planned", "ongoing", "completed"],
        default: "planned"
    },

    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Player" }
    ],

    participantsPlay: {
        type: Number,
        default: null
    },

    participantsRequired: {
        type: Number,
        default: function () {
            return this.participantsPlay;
        },
    },
}, { timestamps: true });

const TournamentModel = mongoose.model("Tournament", tournamentSchema);
export default TournamentModel;
