import { cn } from "@/lib/utils";
import type { OptionType } from "../lib/types/optionType";
import useVote from "../lib/hooks/useVote";
import { usePollContext } from "../lib/context/PollContext";

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
	const { mutate: submitVote } = useVote();

	const barColor: Record<number, string> = {
		0: "bg-red-500",
		1: "bg-green-500",
		2: "bg-blue-500",
		3: "bg-purple-500",
	};

	const { poll, totalVotes } = usePollContext();

	const percentage = (opt.votes / totalVotes) * 100;

	return (
		<button
			className="relative cursor-pointer w-full flex py-2 rounded-[8px] px-4 overflow-hidden"
			onClick={() => submitVote({ optionId: opt.id, pollId: poll.id ?? "" })}
		>
			<div className="flex justify-between w-full font-semibold">
				<p>{opt.text}</p>
				<p>{percentage.toFixed(2)}%</p>
			</div>
			<div
				className={cn("absolute top-0 bottom-0 left-0 z-[-10]", barColor[index])}
				style={{ width: `${percentage}%` }}
			/>
		</button>
	);
};
