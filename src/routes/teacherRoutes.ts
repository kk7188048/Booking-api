import { Router } from "express";
import { createTeacher } from "../controllers/teacherController";

const router = Router();

router.post("/", createTeacher);

export default router;
