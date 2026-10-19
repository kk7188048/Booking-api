import { Request, Response, NextFunction } from "express";
import Teacher from "../models/Teacher";

export const createTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, specialization, experience } = req.body;

    if (!fullName || !email || !specialization || !experience) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const existing = await Teacher.findOne({ email });
    if (existing) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    const teacher = await Teacher.create({ fullName, email, specialization, experience });
    res.status(201).json(teacher);
  } catch (err) {
    next(err);
  }
};
