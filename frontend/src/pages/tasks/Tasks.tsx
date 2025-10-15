import { Button } from "@/components/ui/button";
import { EllipsisVertical, Plus } from "lucide-react";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import type { Action, Task } from "./lib/types";
import { CreateTaskModal } from "./CreateTaskModal";
import { DeleteTaskModal } from "./DeleteTaskModal";
import { useErrorStore } from "./store/errorsStore";
import EditTaskModal from "./EditTaskModal";
import { AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

function reducer(currrentTasks: Task[], action: Action): Task[] {
	switch (action.type) {
		case "add":
			return [...currrentTasks, action.task];
		case "delete":
			return currrentTasks.map((c) => (c.id === action.id ? { ...c, status: "deleting" } : c));
		case "edit":
			return currrentTasks.map((c) => (c.id === action.id ? { ...c, status: "editing" } : c));
		case "status":
			return currrentTasks.map((c) => (c.id === action.id ? { ...c, status: "status" } : c));
		default:
			return currrentTasks;
	}
}

export default function Tasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isCreateTask, setIsCreateTask] = useState(false);
	const [isDeleteTask, setIsDeleteTask] = useState(false);
	const [isEditTask, setIsEditTask] = useState(false);
	const [menuOpen, setMenuOpen] = useState<string | null>(null);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [optimisticTasks, setOptimisticTasks] = useOptimistic<Task[], Action>(tasks, reducer);
	const { errors, setErrors } = useErrorStore();

	useEffect(() => {
		async function fetchPosts() {
			try {
				const res = await fetch("http://localhost:3291/tasks");
				const data = await res.json();
				if (!res.ok) {
					setErrors("fetch", data.error);
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				setTasks(data);
			} catch (err) {
				console.error("Unable to fetch posts:", err);
				setErrors("fetch", "Unable to fetch tasks");
			}
		}
		fetchPosts();
	}, [setErrors, setTasks]);

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (!menuOpen) return;

			const target = e.target as HTMLElement | null;
			const menus = document.querySelectorAll(".menu-dropdown");
			if (target && !Array.from(menus).some((menu) => menu.contains(target))) {
				setMenuOpen(null);
			}
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, [menuOpen]);

	const handleStatus = (task: Task) => {
		setSelectedTask(task);

		startTransition(async () => {
			setOptimisticTasks({ type: "status", id: task.id });
			try {
				const res = await fetch(`http://localhost:3291/tasks/${task.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ taskStatus: "completed" }),
				});
				if (!res.ok) throw new Error("Issue updating task status");

				setTasks((prev) =>
					prev.map((t) => (t.id === task.id ? { ...t, taskStatus: "completed" } : t))
				);
			} catch (error) {
				console.error("Failed to update task", error);
			}
		});
		setMenuOpen(null);
	};
	return (
		<div className="max-w-2xl mx-auto p-4">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-y-3 mb-8">
				<h1 className="text-3xl font-bold">Task Manager</h1>
				<Button
					className="flex items-center w-max gap-2 bg-blue-600 hover:bg-blue-700 transition"
					onClick={() => setIsCreateTask(!isCreateTask)}
				>
					<Plus className="w-5 h-5" />
					<span>Create Task</span>
				</Button>
			</div>

			{errors.fetch && <p className="text-red-500 font-medium">{errors.fetch}</p>}
			{/* Task list */}
			<div className="flex flex-col gap-4">
				{optimisticTasks.map((task) => (
					<div
						key={task.id}
						className={cn(
							"bg-white border rounded-xl p-4",
							task.taskStatus === "completed" && "opacity-50 text-gray-400 cursor-not-allowed"
						)}
					>
						<div className="w-full flex justify-between items-center">
							<div className="flex items-center gap-3 flex-wrap">
								<h3 className="font-semibold text-[clamp(14px,5vw,18px)] break-words leading-[1.2]">
									{task.taskName}
								</h3>

								<div className="flex items-center gap-2">
									{/* Status Badge */}
									<span
										className={cn(
											"inline-block px-2 py-1 text-[clamp(10px,2vw,12px)] font-medium rounded-full leading-[1]",
											task.taskStatus === "not started" ? "bg-gray-100 text-gray-700" : "",
											task.taskStatus === "started" ? "bg-yellow-100 text-yellow-700" : "",
											task.taskStatus === "completed" ? "bg-green-100 text-green-700" : "",
											task.status === "status" ? "opacity-50" : ""
										)}
									>
										{task.taskStatus}
									</span>

									{/* Priority Badge */}
									<span
										className={cn(
											"inline-block px-2 py-1 text-[clamp(10px,2vw,12px)] font-medium rounded-full leading-[1]",
											task.taskPriority === "low" ? "bg-gray-100 text-gray-700" : "",
											task.taskPriority === "medium" ? "bg-blue-100 text-blue-700" : "",
											task.taskPriority === "high" ? "bg-red-100 text-red-700" : ""
										)}
									>
										{task.taskPriority}
									</span>
								</div>
							</div>

							{/* Menu */}
							<div className="relative menu-dropdown">
								<button
									onClick={() => setMenuOpen(menuOpen === task.id ? null : task.id)}
									className="p-2 hover:bg-gray-100 rounded-[6px]"
								>
									<EllipsisVertical className="w-5 h-5" />
								</button>

								{menuOpen === task.id && (
									<ul className="absolute right-0 mt-2 w-max bg-white border rounded-lg p-1 shadow-lg z-10">
										<li>
											<button
												onClick={() => handleStatus(task)}
												className={cn(
													"w-full text-left px-4 py-2 text-sm rounded-[4px]",
													task.taskStatus === "completed"
														? "opacity-50 text-gray-400 cursor-not-allowed"
														: "text-green-500 hover:bg-green-50"
												)}
											>
												Mark as completed
											</button>
										</li>
										<li>
											<button
												className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-[4px]"
												onClick={() => {
													setSelectedTask(task);
													setIsEditTask(true);
													setMenuOpen(null);
												}}
											>
												Edit Task
											</button>
										</li>
										<li>
											<button
												onClick={() => {
													setSelectedTask(task);
													setIsDeleteTask(true);
													setMenuOpen(null);
												}}
												className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-[4px]"
											>
												Delete Task
											</button>
										</li>
									</ul>
								)}
							</div>
						</div>
						<p>{task.taskDescription}</p>
					</div>
				))}
			</div>

			{/* Create task modal */}
			<AnimatePresence>
				{isCreateTask && (
					<CreateTaskModal
						setIsCreateTask={setIsCreateTask}
						setTasks={setTasks}
						tasks={tasks}
						setOptimisticTasks={setOptimisticTasks}
					/>
				)}
			</AnimatePresence>

			{/* Delete task modal */}
			<AnimatePresence>
				{isDeleteTask && selectedTask && (
					<DeleteTaskModal
						setTasks={setTasks}
						setIsDeleteTask={setIsDeleteTask}
						selectedTask={selectedTask}
						tasks={tasks}
						setOptimisticTasks={setOptimisticTasks}
						optimisticTasks={optimisticTasks}
					/>
				)}
			</AnimatePresence>

			{/* Edit task modal */}
			<AnimatePresence>
				{isEditTask && selectedTask && (
					<EditTaskModal
						setTasks={setTasks}
						setIsEditTask={setIsEditTask}
						selectedTask={selectedTask}
						tasks={tasks}
						setOptimisticTasks={setOptimisticTasks}
						optimisticTasks={optimisticTasks}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
