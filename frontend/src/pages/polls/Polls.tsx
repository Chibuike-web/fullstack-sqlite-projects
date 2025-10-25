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

// export const polls: PollType[] = [
// 	{
// 		id: crypto.randomUUID(),
// 		question: "Which JavaScript framework do you prefer?",
// 		options: [
// 			{ id: 1, text: "React", votes: 45 },
// 			{ id: 2, text: "Vue", votes: 22 },
// 			{ id: 3, text: "Svelte", votes: 18 },
// 			{ id: 4, text: "Angular", votes: 10 },
// 		],
// 		createdAt: "2025-10-05T12:00:00Z",
// 	},
// 	{
// 		id: crypto.randomUUID(),
// 		question: "What time of day are you most productive?",
// 		options: [
// 			{ id: 1, text: "Morning", votes: 32 },
// 			{ id: 2, text: "Afternoon", votes: 27 },
// 			{ id: 3, text: "Night", votes: 41 },
// 		],
// 		createdAt: "2025-10-06T09:30:00Z",
// 	},
// 	{
// 		id: crypto.randomUUID(),
// 		question: "Which frontend tool do you use most often?",
// 		options: [
// 			{ id: 1, text: "Vite", votes: 38 },
// 			{ id: 2, text: "Webpack", votes: 14 },
// 			{ id: 3, text: "Parcel", votes: 9 },
// 			{ id: 4, text: "RSBuild", votes: 5 },
// 		],
// 		createdAt: "2025-10-04T16:45:00Z",
// 	},
// 	{
// 		id: crypto.randomUUID(),
// 		question: "Do you prefer dark mode or light mode?",
// 		options: [
// 			{ id: 1, text: "Dark mode", votes: 80 },
// 			{ id: 2, text: "Light mode", votes: 25 },
// 		],
// 		createdAt: "2025-10-02T10:15:00Z",
// 	},
// 	{
// 		id: crypto.randomUUID(),
// 		question: "How do you usually learn new programming concepts?",
// 		options: [
// 			{ id: 1, text: "YouTube tutorials", votes: 33 },
// 			{ id: 2, text: "Official documentation", votes: 44 },
// 			{ id: 3, text: "Online courses", votes: 28 },
// 			{ id: 4, text: "Trial and error", votes: 19 },
// 		],
// 		createdAt: "2025-10-01T18:00:00Z",
// 	},
// ];
