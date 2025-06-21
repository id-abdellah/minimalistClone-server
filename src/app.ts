import dotenv from "dotenv"
dotenv.config();
import express from "express"
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler"
import { usersRouter } from "./routes/users.route";

const port = +process.env.PORT!
const hostname = process.env.HOSTNAME!

const app = express();

app.use(express.json());

app.use("/api/users", usersRouter)

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname, (err) => {
    console.log("server is running on => ", `http://${hostname}:${port}`)
});