import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPoll } from "../api/createPoll";

export default function useCreatePoll() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPoll,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["polls"] });
		},
		onError: (error) => {
			console.error("Poll creation failed:", error);
		},
	});
}
