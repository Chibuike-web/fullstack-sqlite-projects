import { Router } from "express";
import { db } from "../../tasks/lib/index";
import { tasks } from "../../tasks/lib/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (_, res) => {
	try {
		const result = await db.select().from(tasks).all();
		res.json(result);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch tasks" });
	}
});

router.post("/", async (req, res) => {
	console.log("Incoming body:", req.body);

	const { taskName, taskDescription, taskStatus, taskPriority, taskStartDate, taskDueDate } =
		req.body;
	if (
		!taskName ||
		!taskDescription ||
		!taskStatus ||
		!taskPriority ||
		!taskStartDate ||
		!taskDueDate
	) {
		return res.status(400).json({ error: "All fields are required" });
	}

	try {
		const newTask = await db
			.insert(tasks)
			.values({
				taskName,
				taskDescription,
				taskStatus,
				taskPriority,
				taskStartDate,
				taskDueDate,
			})
			.returning()
			.get();

		console.log(newTask);
		res.status(200).json(newTask);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to create task" });
	}
});

router.delete("/:taskId", async (req, res) => {
	const taskId = req.params.taskId;
	if (!taskId) return res.status(400).json({ error: "Id missing" });

	try {
		const deleted = await db
			.delete(tasks)
			.where(eq(tasks.id, Number(taskId)))
			.returning();

		if (deleted.length === 0) {
			return res.status(404).json({ message: "Task not found" });
		}
		res.json({ message: "Task deleted", deleted });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to delete task" });
	}
});

router.put("/:taskId", async (req, res) => {
	try {
		const taskId = req.params.taskId;
		if (!taskId) return res.status(400).json({ message: "Id is missing" });
		const { taskName, taskDescription, taskStatus, taskPriority, taskStartDate, taskDueDate } =
			req.body;
		if (
			!taskName ||
			!taskDescription ||
			!taskStatus ||
			!taskPriority ||
			!taskStartDate ||
			!taskDueDate
		)
			return res.status(400).json({ error: "All fields are required" });

		const updateData = {
			taskName,
			taskDescription,
			taskStatus,
			taskPriority,
			taskStartDate,
			taskDueDate,
		};

		const updated = await db
			.update(tasks)
			.set(updateData)
			.where(eq(tasks.id, Number(taskId)))
			.returning();

		if (updated.length === 0) {
			return res.status(400).json({ message: "Task not found" });
		}

		res.json({ message: "Task updated", updated: updated[0] });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to update task" });
	}
});
export default router;
