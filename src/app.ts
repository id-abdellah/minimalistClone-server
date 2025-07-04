import dotenv from "dotenv"
dotenv.config();
import express from "express"
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler"
import { usersRouter } from "./routes/users.route";
import path from "path";
import cors from "cors"
import { listsRouter } from "./routes/lists.route";
import { tasksRouter } from "./routes/tasks.route";

const port = +process.env.PORT!
const hostname = process.env.HOSTNAME!

const app = express();

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json());
app.use("/api/useravatar", express.static(path.join(__dirname, "../uploads")))
app.use(express.static(path.join(__dirname, "../client")))

// api routes
app.use("/api/users", usersRouter);
app.use("/api/lists", listsRouter);
app.use("/api/tasks", tasksRouter);

// serving frontend
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
})

// globla errors handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname, (err) => {
    console.log("server is running on => ", `http://${hostname}:${port}`)
});