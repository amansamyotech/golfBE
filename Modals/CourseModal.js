import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    courseNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    holes: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CourseModel = mongoose.model("Course", courseSchema);
export default CourseModel;
