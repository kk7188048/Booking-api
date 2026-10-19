import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/sessions", sessionRoutes);
app.use("/teachers", teacherRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
