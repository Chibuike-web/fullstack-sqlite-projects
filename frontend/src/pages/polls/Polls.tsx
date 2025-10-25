import { useQuery } from "@tanstack/react-query";
import Poll from "./components/Poll";
import PollsLayout from "./PollsLayout";
import { fetchPolls } from "./lib/api/fetchPolls";
import type { PollType } from "./lib/types/pollType";
import type { OptionType } from "./lib/types/optionType";

export default function Polls() {
	return (
		<PollsLayout>
			<div className="flex flex-col gap-8">
				<PollsList />
			</div>
		</PollsLayout>
	);
}

const PollsList = () => {
	const { data, isLoading, isError, error, failureCount } = useQuery({
		queryKey: ["polls"],
		queryFn: fetchPolls,
		retry: 2,
		retryDelay: (attempt) => 1000 * attempt,
		staleTime: Infinity,
		gcTime: Infinity,
	});

	if (isLoading) return <p>Loading polls...</p>;
	if (isError)
		return (
			<p>
				Failed after {failureCount} retries: {(error as Error).message}
			</p>
		);

	const rawPolls = data.result as PollType[];

	const polls = rawPolls.map((item) => ({
		...item,
		options: typeof item.options === "string" ? JSON.parse(item.options) : item.options,
	}));

	if (!polls.length) {
		return <p className="text-foreground/60">No polls available yet.</p>;
	}
	return (
		<>
			{polls.map((poll) => {
				const totalVotes = poll.options.reduce(
					(sum: number, opt: OptionType) => sum + (opt.votes ?? 0),
					0
				);
				return (
					<div key={poll.id} className="flex flex-col gap-4">
						<h2 className="text-[20px] font-semibold">{poll.question}</h2>
						<div className="flex flex-col gap-3">
							<Poll options={poll.options} totalVotes={totalVotes} />
							<p className="text-foreground/50 font-medium">{totalVotes} votes - Final results</p>
						</div>
					</div>
				);
			})}
		</>
	);
};
