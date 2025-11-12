import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPoll } from "../api/createPoll";
import type { PollType } from "../types/pollType";

export default function useCreatePoll(userId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: PollType) => createPoll(data, userId),

		onMutate: async (newPoll) => {
			await queryClient.cancelQueries({ queryKey: ["polls"] });

			const previousPolls = queryClient.getQueryData<PollType[]>(["polls"]) || [];

			const optimisticPoll: PollType = {
				...newPoll,
				id: crypto.randomUUID(),
				createdAt: new Date().toISOString(),
				options: newPoll.options || [],
			};

			queryClient.setQueryData(["polls"], (oldData: PollType[]) => {
				const oldPolls = Array.isArray(oldData) ? oldData : [];
				return [...oldPolls, optimisticPoll];
			});

			return { previousPolls };
		},

		onError: (error, _, context) => {
			console.error("Poll creation failed:", error);
			if (context?.previousPolls) {
				queryClient.setQueryData(["polls"], context.previousPolls);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["polls"] });
		},
	});
}
