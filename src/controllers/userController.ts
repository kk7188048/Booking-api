import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Session from "../models/Session";
import mongoose from "mongoose";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
      res.status(400).json({ error: "fullName, email and phone are required" });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    const user = await User.create({ fullName, email, phone });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUserSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const result = await Session.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "teachers",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },
      {
        $group: {
          _id: null,
          upcoming: {
            $push: {
              $cond: [{ $eq: ["$status", "BOOKED"] }, "$$ROOT", null],
            },
          },
          completed: {
            $push: {
              $cond: [{ $eq: ["$status", "COMPLETED"] }, "$$ROOT", null],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          upcoming: {
            $filter: { input: "$upcoming", cond: { $ne: ["$$this", null] } },
          },
          completed: {
            $filter: { input: "$completed", cond: { $ne: ["$$this", null] } },
          },
        },
      },
    ]);

    const sessions = result[0] || { upcoming: [], completed: [] };
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};
