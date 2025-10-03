import express from "express";
import postsRouter from "./routes/posts";
import tasksRouter from "./routes/tasks";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Credentials", "true");

	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}

	next();
});

app.use("/posts", postsRouter);
app.use("/tasks", tasksRouter);

app.listen(3291, () => {
	console.log("Server running on http://localhost:3291");
});
