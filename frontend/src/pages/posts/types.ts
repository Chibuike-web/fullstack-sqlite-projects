export type Post = {
	id: string;
	content: string;
	likes: number;
	dislikes: number;
	status?: "reacting" | "editing" | "deleting";
};

export type Action =
	| { type: "add"; post: Post }
	| { type: "edit"; id: string; content: string }
	| { type: "delete"; id: string }
	| { type: "reaction"; id: string };
