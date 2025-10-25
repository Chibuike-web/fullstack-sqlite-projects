import express from "express";
import postsRouter from "./routes/posts";
import tasksRouter from "./routes/tasks";
import pollsRouter from "./routes/polls/polls";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

const origin = "http://localhost:5173";
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.setHeader("Access-Control-Allow-Credentials", "true");

	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}

	next();
});

app.use("/posts", postsRouter);
app.use("/tasks", tasksRouter);
app.use("/polls", pollsRouter);

app.listen(3291, () => {
	console.log("Server running on http://localhost:3291");
});
