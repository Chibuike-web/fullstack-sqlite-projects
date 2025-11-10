import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vote } from "../api/vote";
import type { PollType } from "../types/pollType";
import type { OptionType } from "../types/optionType";

export default function useVote(userId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ optionId, pollId }: { optionId: number; pollId: string }) =>
			vote(optionId, pollId, userId),

		onMutate: async ({ optionId, pollId }) => {
			await queryClient.cancelQueries({ queryKey: ["poll"] });
			const prevPolls = queryClient.getQueryData<PollType[]>(["polls"]);

			queryClient.setQueryData(["poll"], (old: PollType[]) => {
				if (!old) return;
				return old.map((poll) => {
					if (poll.id === pollId) {
						const updatedOptions = poll.options.map((opt: OptionType) =>
							opt.id === optionId ? { ...opt, votes: (opt.votes ?? 0) + 1 } : opt
						);
						return { ...poll, options: updatedOptions };
					}
					return poll;
				});
			});
			return { prevPolls };
		},
		onError: (_err, _variables, context) => {
			queryClient.setQueryData(["polls"], context?.prevPolls);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["polls"] });
		},
	});
}
