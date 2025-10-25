import type { OptionType } from "./optionType";

export type PollType = {
	id?: string;
	question: string;
	options: string | OptionType[];
	createdAt?: string;
};
