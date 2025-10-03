import { X } from "lucide-react";
import type { Action, Task } from "./lib/types";
import { Button } from "@/components/ui/button";
import { startTransition } from "react";
import { MotionDiv } from "@/lib/MotionComponent";

export type DeleteModalType = {
	selectedTask: Task;
	optimisticTasks: Task[];
	tasks: Task[];
	setTasks: (value: Task[]) => void;
	setOptimisticTasks: (value: Action) => void;
	setIsDeleteTask: (value: boolean) => void;
};

export const DeleteTaskModal = ({
	setIsDeleteTask,
	optimisticTasks,
	tasks,
	selectedTask,
	setTasks,
	setOptimisticTasks,
}: DeleteModalType) => {
	const task = optimisticTasks.find((t) => t.id === selectedTask.id);
	if (!task) return;

	const handleDelete = (taskId: string) => {
		if (!taskId) return;

		startTransition(async () => {
			setOptimisticTasks({ type: "delete", id: taskId });
			try {
				const res = await fetch(`http://localhost:3291/tasks/${taskId}`, {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
				});

				if (!res.ok) {
					throw new Error("Issue deleting task");
				}
				setTasks(tasks.filter((t) => t.id !== taskId));
				setIsDeleteTask(false);
			} catch (error) {
				console.error("Failed to delete task", error);
			}
		});
	};
	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/50 z-20 px-4"
			onClick={() => setIsDeleteTask(false)}
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
					<h2 className="text-lg font-semibold">Delete Task</h2>
					<button
						onClick={() => setIsDeleteTask(false)}
						className="p-1 hover:bg-gray-100 rounded-full"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<p className="text-gray-600 mb-6">
					Are you sure you want to delete <span className="font-semibold">{task.taskName}</span>?
					This action cannot be undone.
				</p>

				<div className="flex flex-col sm:flex-row sm:justify-end gap-3 ">
					<Button onClick={() => setIsDeleteTask(false)} variant="outline">
						Cancel
					</Button>
					<Button
						onClick={() => handleDelete(task.id)}
						variant="destructive"
						disabled={task.status === "deleting"}
					>
						{task.status === "deleting" ? "Deleting..." : "Delete"}
					</Button>
				</div>
			</MotionDiv>
		</div>
	);
};
