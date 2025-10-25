import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreatePollModal from "./components/CreatePollModal";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "./lib/api/fetchUser";

export default function PollsLayout({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const { data, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: fetchUser,
		retry: 2,
		retryDelay: (attempt) => 1000 * attempt,
		staleTime: Infinity,
		gcTime: Infinity,
	});

	if (isLoading) return;

	return (
		<div>
			<header className="border-b border-foreground/10 ">
				<nav className="max-w-[600px] mx-auto flex justify-between py-4 px-6 xl:px-0">
					<span className="text-[20px] font-bold text-center">PollSpace</span>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<button className="size-8 flex items-center justify-between cursor-pointer">
								<Bell />
							</button>
							<button className="size-8 flex items-center justify-between cursor-pointer">
								<Search />
							</button>
						</div>
						<span className="size-8 bg-foreground text-white font-bold text-[14px] rounded-full flex items-center justify-center">
							{data.name
								.split(" ")
								.map((part: string) => part[0])
								.join("")}{" "}
						</span>
					</div>
				</nav>
			</header>
			<main className="py-6 max-w-[600px] flex flex-col gap-6 mx-auto px-6 xl:px-0">
				<Button className="w-max" onClick={() => setOpen(true)}>
					Create New Poll
				</Button>
				{children}
			</main>

			<CreatePollModal open={open} setOpen={setOpen} />
		</div>
	);
}
