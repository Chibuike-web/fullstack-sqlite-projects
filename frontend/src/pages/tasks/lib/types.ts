export type Task = {
	id: string;
	taskName: string;
	taskDescription?: string;
	taskStatus: "not started" | "started" | "completed";
	taskPriority?: "low" | "medium" | "high";
	taskStartDate: string;
	taskDueDate: string;
	status?: "editing" | "deleting";
};

export type Action =
	| { type: "add"; task: Task }
	| { type: "edit"; id: string }
	| { type: "delete"; id: string }
	| { type: "reaction"; id: string };

export type TaskErrors = {
	taskNameError: string;
	taskDescriptionError: string;
	taskStartDateError: string;
	taskDueDateError: string;
};
