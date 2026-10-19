import { Schema, model } from "mongoose";

const teacherSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model("Teacher", teacherSchema);
