import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPoll } from "../api/createPoll";
import type { PollType } from "../types/pollType";

export default function useCreatePoll(userId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: PollType) => createPoll(data, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["polls"] });
		},
		onError: (error) => {
			console.error("Poll creation failed:", error);
		},
	});
}
