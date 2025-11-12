import { cn } from "@/lib/utils";
import type { OptionType } from "../lib/types/optionType";
import useVote from "../lib/hooks/useVote";
import { usePollContext } from "../lib/context/PollContext";
import { useParams } from "react-router";

export default function Poll() {
	const { poll } = usePollContext();
	return (
		<div className="flex flex-col gap-2">
			{poll.options.map((opt, index) => (
				<PollBar key={opt.id} opt={opt} index={index} />
			))}
		</div>
	);
}

const PollBar = ({ opt, index }: { opt: OptionType; index: number }) => {
	const { userId } = useParams();

	const { mutate: submitVote, isPending } = useVote(userId ?? "");

	const barColor: Record<number, string> = {
		0: "bg-red-500",
		1: "bg-green-500",
		2: "bg-blue-500",
		3: "bg-purple-500",
	};

	const { poll, totalVotes } = usePollContext();

	const percentage = totalVotes === 0 ? 0 : (opt.votes / totalVotes) * 100;

	return (
		<button
			className={cn(
				"relative cursor-pointer w-full flex py-2 rounded-[8px] px-4 overflow-hidden",
				isPending && "opacity-50"
			)}
			onClick={() => submitVote({ optionId: opt.id, pollId: poll.id ?? "" })}
		>
			<div className="flex justify-between w-full font-semibold">
				<p>{opt.text}</p>
				<p>{percentage.toFixed(2)}%</p>
			</div>
			<div
				className={cn(
					"absolute top-0 bottom-0 left-0 -z-5 rounded-[8px]",
					percentage && barColor[index],
					"transition-all ease-in-out duration-500"
				)}
				style={{ width: `${percentage}%` }}
			/>
			<div className="absolute top-0 bottom-0 left-0 right-0 -z-10 bg-gray-100" />
		</button>
	);
};
