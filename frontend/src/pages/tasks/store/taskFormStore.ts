import { create } from "zustand";

export type TaskStatus = "not started" | "started" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export type TaskDates = {
	startDate: string;
	dueDate: string;
};

type TaskFormState = {
	taskName: string;
	taskDescription: string;
	taskStatus: TaskStatus;
	taskPriority: TaskPriority;
	taskDates: TaskDates;

	// setters
	setTaskName: (name: string) => void;
	setTaskDescription: (desc: string) => void;
	setTaskStatus: (status: TaskStatus) => void;
	setTaskPriority: (priority: TaskPriority) => void;
	setTaskDates: (dates: Partial<TaskDates>) => void;
	resetTaskForm: () => void;
};

const taskFormStore = create<TaskFormState>((set) => ({
	taskName: "",
	taskDescription: "",
	taskStatus: "not started",
	taskPriority: "low",
	taskDates: {
		startDate: "",
		dueDate: "",
	},

	setTaskName: (taskName) => set({ taskName }),
	setTaskDescription: (taskDescription) => set({ taskDescription }),
	setTaskStatus: (taskStatus) => set({ taskStatus }),
	setTaskPriority: (taskPriority) => set({ taskPriority }),
	setTaskDates: (dates) =>
		set((state) => ({
			taskDates: { ...state.taskDates, ...dates },
		})),
	resetTaskForm: () =>
		set({
			taskName: "",
			taskDescription: "",
			taskStatus: "not started",
			taskPriority: "low",
			taskDates: {
				startDate: "",
				dueDate: "",
			},
		}),
}));

export const useTaskFormStore = () => {
	const taskName = taskFormStore((s) => s.taskName);
	const taskDescription = taskFormStore((s) => s.taskDescription);
	const taskStatus = taskFormStore((s) => s.taskStatus);
	const taskPriority = taskFormStore((s) => s.taskPriority);
	const taskDates = taskFormStore((s) => s.taskDates);
	const setTaskName = taskFormStore((s) => s.setTaskName);
	const setTaskDescription = taskFormStore((s) => s.setTaskDescription);
	const setTaskStatus = taskFormStore((s) => s.setTaskStatus);
	const setTaskPriority = taskFormStore((s) => s.setTaskPriority);
	const setTaskDates = taskFormStore((s) => s.setTaskDates);
	const resetTaskForm = taskFormStore((s) => s.resetTaskForm);

	return {
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
	};
};
