import { startTransition, useEffect, useState, type FormEvent } from "react";
import type { Action, Task, TaskErrors } from "./lib/types";
import { useTaskFormStore, type TaskPriority, type TaskStatus } from "./store/taskFormStore";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/lib/MotionComponent";

export type EditModalType = {
	tasks: Task[];
	selectedTask: Task;
	optimisticTasks: Task[];
	setIsEditTask: (value: boolean) => void;
	setTasks: (value: Task[]) => void;
	setOptimisticTasks: (value: Action) => void;
};

export default function EditTaskModal({
	tasks,
	selectedTask,
	optimisticTasks,
	setIsEditTask,
	setTasks,
	setOptimisticTasks,
}: EditModalType) {
	const task = optimisticTasks.find((t) => t.id === selectedTask.id);
	const {
		taskName,
		taskDescription,
		taskStatus,
		taskPriority,
		taskDates,
		setTaskName,
		setTaskDescription,
		setTaskStatus,
		setTaskPriority,
		setTaskDates,
		resetTaskForm,
	} = useTaskFormStore();

	const [taskErrors, setTaskErrors] = useState<TaskErrors>({
		taskNameError: "",
		taskDescriptionError: "",
		taskStartDateError: "",
		taskDueDateError: "",
	});

	useEffect(() => {
		if (!task) return;
		setTaskName(task.taskName);
		setTaskDescription(task.taskDescription ?? "");
		setTaskStatus(task.taskStatus as TaskStatus);
		setTaskPriority(task.taskPriority as TaskPriority);
		setTaskDates({
			startDate: task.taskStartDate,
			dueDate: task.taskDueDate,
		});
	}, [task, setTaskName, setTaskDescription, setTaskStatus, setTaskPriority, setTaskDates]);

	if (!task) return;

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { id, value } = e.target;

		switch (id) {
			case "taskName":
				if (taskErrors.taskNameError && value.trim()) {
					setTaskErrors((prev) => ({ ...prev, taskNameError: "" }));
				}
				setTaskName(value);
				break;
			case "taskDescription":
				if (taskErrors.taskDescriptionError && value.trim()) {
					setTaskErrors((prev) => ({ ...prev, taskDescriptionError: "" }));
				}
				setTaskDescription(value);
				break;
			case "taskStatus":
				setTaskStatus(value as TaskStatus);
				break;
			case "taskPriority":
				setTaskPriority(value as TaskPriority);
				break;
			case "startDate":
				if (taskErrors.taskStartDateError && value.trim()) {
					setTaskErrors((prev) => ({ ...prev, taskStartDateError: "" }));
				}
				setTaskDates({ ...taskDates, startDate: value });
				break;
			case "dueDate":
				if (taskErrors.taskDueDateError && value.trim()) {
					setTaskErrors((prev) => ({ ...prev, taskDueDateError: "" }));
				}
				setTaskDates({ ...taskDates, dueDate: value });
				break;
		}
	};

	const handleEditModal = async (e: FormEvent) => {
		e.preventDefault();
		// const startTimestamp = new Date(taskDates.startDate).getTime();
		// const dueTimestamp = new Date(taskDates.dueDate).getTime();
		// const durationMs = dueTimestamp - startTimestamp;
		// const duration = formatDuration(durationMs);

		const newErrors: TaskErrors = {
			taskNameError: "",
			taskDescriptionError: "",
			taskStartDateError: "",
			taskDueDateError: "",
		};

		if (!taskName.trim()) newErrors.taskNameError = "Task name is required";
		if (!taskDescription.trim()) newErrors.taskDescriptionError = "Task description is required";
		if (!taskDates.startDate.trim()) newErrors.taskStartDateError = "Start date is required";
		if (!taskDates.dueDate.trim()) newErrors.taskDueDateError = "Due date is required";

		setTaskErrors(newErrors);
		if (Object.values(newErrors).some((item) => item !== "")) return;

		const updatedTask: Task = {
			...task,
			taskName,
			taskDescription,
			taskStatus: taskStatus.toLowerCase() as Task["taskStatus"],
			taskPriority: taskPriority.toLowerCase() as Task["taskPriority"],
			taskStartDate: taskDates.startDate,
			taskDueDate: taskDates.dueDate,
		};

		startTransition(async () => {
			setOptimisticTasks({ type: "edit", id: task.id });
			try {
				const res = await fetch(`http://localhost:3291/tasks/${task.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedTask),
				});
				const data = await res.json();
				if (!res.ok) throw new Error("Issue updating task");

				setTasks(tasks.map((t) => (t.id === task.id ? data.updated : t)));
				setIsEditTask(false);
				resetTaskForm();
			} catch (error) {
				console.error("Failed to update task", error);
			}
		});
	};

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/50 z-20 px-4"
			onClick={() => setIsEditTask(false)}
		>
			<MotionDiv
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.2 }}
				className="bg-white rounded-2xl shadow-lg w-full max-w-md p-4"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold">Edit Task</h2>
					<button
						onClick={() => setIsEditTask(false)}
						className="p-1 hover:bg-gray-100 rounded-full"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form */}
				<form className="flex flex-col gap-4" onSubmit={handleEditModal}>
					{/* Task name */}
					<div className="flex flex-col gap-2">
						<Label htmlFor="taskName">Task name</Label>
						<Input
							id="taskName"
							value={taskName}
							onChange={handleChange}
							aria-required
							aria-invalid={taskErrors.taskNameError ? true : false}
						/>
						{taskErrors.taskNameError && (
							<p className="text-destructive text-[14px]">{taskErrors.taskNameError}</p>
						)}
					</div>
					{/* Description */}
					<div className="flex flex-col gap-2">
						<Label htmlFor="taskDescription">Description</Label>
						<Textarea
							id="taskDescription"
							value={taskDescription}
							onChange={handleChange}
							aria-required
							aria-invalid={taskErrors.taskDescriptionError ? true : false}
						/>
						{taskErrors.taskDescriptionError && (
							<p className="text-destructive text-[14px]">{taskErrors.taskDescriptionError}</p>
						)}
					</div>
					{/* Status */}
					<div className="flex flex-col gap-2">
						<Label htmlFor="taskStatus" className="text-sm font-medium">
							Status
						</Label>
						<select
							id="taskStatus"
							className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
							value={taskStatus}
							onChange={handleChange}
						>
							<option value="not started">Not Started</option>
							<option value="started">Started</option>
							<option value="completed">Completed</option>
						</select>
					</div>
					{/* Dates */}
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="startDate" className="text-sm font-medium">
								Start Date
							</Label>
							<input
								id="startDate"
								type="date"
								value={taskDates.startDate}
								aria-invalid={taskErrors.taskStartDateError ? true : false}
								onChange={handleChange}
								className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
							/>
							{taskErrors.taskStartDateError && (
								<p className="text-destructive text-[14px]">{taskErrors.taskStartDateError}</p>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="dueDate" className="text-sm font-medium">
								Due Date
							</Label>
							<input
								id="dueDate"
								name="dueDate"
								type="date"
								value={taskDates.dueDate}
								aria-invalid={taskErrors.taskDueDateError ? true : false}
								onChange={handleChange}
								className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
							/>
							{taskErrors.taskDueDateError && (
								<p className="text-destructive text-[14px]">{taskErrors.taskDueDateError}</p>
							)}
						</div>
					</div>
					{/* Priority */}
					<div className="flex flex-col gap-2">
						<Label htmlFor="taskPriority">Priority</Label>
						<select
							id="taskPriority"
							className="border rounded-lg px-3 py-2 text-sm"
							value={taskPriority}
							onChange={handleChange}
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
						</select>
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-3 mt-4">
						<Button type="button" variant="outline" onClick={() => setIsEditTask(false)}>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700"
							disabled={task.status === "editing"}
						>
							{task.status === "editing" ? "Updating..." : "Update"}
						</Button>
					</div>
				</form>
			</MotionDiv>
		</div>
	);
}
