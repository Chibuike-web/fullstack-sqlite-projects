import { Bell, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PollsLayout({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
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
							CM
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

function CreatePollModal({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
	let idRef = useRef(1);
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState([
		{
			id: idRef.current,
			text: "",
			votes: 0,
		},
	]);
	const [errors, setErrors] = useState<{ question: string; options: string }>({
		question: "",
		options: "",
	});

	const addOption = () => {
		setErrors((prev) => ({ ...prev, options: "" }));
		idRef.current += 1;
		setOptions((prev) => [
			...prev,
			{
				id: idRef.current,
				text: "",
				votes: 0,
			},
		]);
	};
	const removeOption = (optId: number) => setOptions((prev) => prev.filter((p) => p.id !== optId));
	const updateOption = (optId: number, value: string) => {
		const updated = [...options];
		const newUpdated = updated.map((u) => (u.id === optId ? { ...u, text: value } : u));
		setOptions(newUpdated);
	};

	const handleSubmit = () => {
		const newErrors: typeof errors = { question: "", options: "" };
		if (!question.trim()) newErrors.question = "Question is required";
		if (options.filter((o) => o.text !== "").length < 2)
			newErrors.options = "At least 2 valid options are required";

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		console.log({ question, options });
		setErrors({ question: "", options: "" });

		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-md">
				<DialogHeader className="flex items-center justify-between">
					<DialogTitle>Create New Poll</DialogTitle>
					<DialogClose asChild>
						<Button variant="ghost" className="size-8 px-0 py-0">
							<X className="size-5" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogClose>
				</DialogHeader>

				<div className="flex flex-col gap-4 mt-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="question">Poll Question</Label>
						<Input
							id="question"
							value={question}
							onChange={(e) => {
								setErrors((prev) => ({ ...prev, question: "" }));
								setQuestion(e.target.value);
							}}
							placeholder="What's your question?"
							aria-invalid={!!errors.question}
							aria-describedby={errors.question ? "question-error" : undefined}
						/>
						{errors.question && (
							<p className="text-red-500 font-medium text-[14px]" id="question-error">
								{errors.question}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<Label>Options</Label>
						<div className="flex flex-col gap-2">
							{options.map((opt) => (
								<div key={opt.id} className="flex items-center gap-2">
									<div className="w-full">
										<Input
											value={opt.text}
											onChange={(e) => {
												updateOption(opt.id, e.target.value);
												setErrors((prev) => ({ ...prev, options: "" }));
											}}
											placeholder={`Option ${opt.id}`}
											aria-invalid={!!errors.options}
											aria-describedby={errors.options ? "option-error" : undefined}
										/>
									</div>
									{options.length > 1 && (
										<Button size="icon" variant="ghost" onClick={() => removeOption(opt.id)}>
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>
							))}
						</div>
						{errors.options && (
							<p className="text-red-500 font-medium text-[14px] mt-2" id="option-error">
								{errors.options}
							</p>
						)}
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="mt-2 flex items-center gap-2 w-max"
							onClick={addOption}
						>
							<Plus className="h-4 w-4" />
							Add Option
						</Button>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit}>Create Poll</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
