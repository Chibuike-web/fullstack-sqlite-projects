import { cn } from "@/lib/utils";
import type { OptionType } from "../lib/types/optionType";

type PollProps = {
	options: OptionType[];
	totalVotes: number;
};

export default function Poll({ options, totalVotes }: PollProps) {
	return (
		<div className="flex flex-col gap-2">
			{options.map((opt, index) => (
				<PollBar key={opt.id} opt={opt} totalVotes={totalVotes} index={index} />
			))}
		</div>
	);
}

const PollBar = ({
	opt,
	totalVotes,
	index,
}: {
	opt: OptionType;
	totalVotes: number;
	index: number;
}) => {
	const barColor: Record<number, string> = {
		0: "bg-red-500",
		1: "bg-green-500",
		2: "bg-blue-500",
		3: "bg-purple-500",
	};

	const percentage = opt.votes ? (opt.votes / totalVotes) * 100 : 0;

	return (
		<button className={cn("flex py-2 rounded-[8px] px-4 cursor-pointer", barColor[index])}>
			<div className="flex justify-between w-full font-semibold">
				<p>{opt.text}</p> <p>{percentage.toFixed(2)}%</p>
			</div>
		</button>
	);
};
