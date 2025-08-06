import express from "express"
import indexRouter from "./routes/index.routes";
import authRouter from "./routes/auth.routes";

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/", indexRouter);
app.use("/api/auth", authRouter);

export default app;