import { create } from "zustand";

type KeyType = "fetch" | "add" | "delete" | "edit";

type ErrorStoreType = {
	errors: { fetch: string; add: string; edit: string; delete: string };
	setErrors: (key: KeyType, message: string) => void;
	resetErrors: () => void;
};

const errorStore = create<ErrorStoreType>((set) => ({
	errors: {
		fetch: "",
		add: "",
		edit: "",
		delete: "",
	},
	setErrors: (key, message) => set((state) => ({ errors: { ...state.errors, [key]: message } })),
	resetErrors: () =>
		set({
			errors: {
				fetch: "",
				add: "",
				edit: "",
				delete: "",
			},
		}),
}));

export const useErrorStore = () => {
	const errors = errorStore((s) => s.errors);
	const setErrors = errorStore((s) => s.setErrors);

	return {
		errors,
		setErrors,
	};
};
