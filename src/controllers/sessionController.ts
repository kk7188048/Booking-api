import { Request, Response, NextFunction } from "express";
import Session from "../models/Session";
import Teacher from "../models/Teacher";
import User from "../models/User";
import mongoose from "mongoose";

export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teacherId, startTime, endTime } = req.body;

    if (!teacherId || !startTime || !endTime) {
      res.status(400).json({ error: "teacherId, startTime and endTime are required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      res.status(400).json({ error: "Invalid teacherId" });
      return;
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      res.status(400).json({ error: "endTime must be greater than startTime" });
      return;
    }

    const session = await Session.create({ teacherId, startTime: start, endTime: end });
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};

export const getAvailableSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dateTimestamp } = req.query;

    if (!dateTimestamp) {
      res.status(400).json({ error: "dateTimestamp query param is required" });
      return;
    }

    const ts = Number(dateTimestamp);
    const dayStart = new Date(ts);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(ts);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const sessions = await Session.aggregate([
      {
        $match: {
          status: "AVAILABLE",
          startTime: { $gte: dayStart, $lte: dayEnd },
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },
    ]);

    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

export const bookSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const session = await Session.findById(id);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    if (session.status !== "AVAILABLE") {
      res.status(400).json({ error: "Session is not available for booking" });
      return;
    }

    session.status = "BOOKED";
    session.userId = new mongoose.Types.ObjectId(userId);
    await session.save();

    res.json(session);
  } catch (err) {
    next(err);
  }
};

export const completeSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid session ID" });
      return;
    }

    const session = await Session.findById(id);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    if (session.status !== "BOOKED") {
      res.status(400).json({ error: "Only BOOKED sessions can be completed" });
      return;
    }

    session.status = "COMPLETED";
    session.completedAt = new Date();
    await session.save();

    res.json(session);
  } catch (err) {
    next(err);
  }
};
