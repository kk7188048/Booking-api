import { Schema, model, Types } from "mongoose";

const sessionSchema = new Schema(
  {
    teacherId: { type: Types.ObjectId, ref: "Teacher", required: true },
    userId: { type: Types.ObjectId, ref: "User", default: null },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED", "COMPLETED"],
      default: "AVAILABLE",
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default model("Session", sessionSchema);
