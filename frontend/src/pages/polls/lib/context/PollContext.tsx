import { createContext, useContext, type ReactNode } from "react";
import type { PollType } from "../types/pollType";

type ContextType = {
	poll: PollType;
	totalVotes: number;
};

const PollContext = createContext<ContextType | null>(null);

export const usePollContext = () => {
	const context = useContext(PollContext);
	if (!context) throw new Error("usePollContext must be used inside PollProvider");
	return context;
};

export default function PollContextProvider({
	value,
	children,
}: {
	value: ContextType;
	children: ReactNode;
}) {
	return <PollContext.Provider value={value}>{children}</PollContext.Provider>;
}
