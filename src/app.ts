import express from "express"
import indexRouter from "./routes/index.routes";
import authRouter from "./routes/auth.routes";
import projectsRouter from "./routes/projects.routes";

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);

export default app;