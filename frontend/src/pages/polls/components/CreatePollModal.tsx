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
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import useCreatePoll from "../lib/hooks/useCreatePoll";

export default function CreatePollModal({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
}) {
	let idRef = useRef(1);
	const { mutateAsync, isPending } = useCreatePoll();
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

	const handleSubmit = async () => {
		const newErrors: typeof errors = { question: "", options: "" };

		if (!question.trim()) newErrors.question = "Question is required";
		if (options.filter((o) => o.text !== "").length < 2)
			newErrors.options = "At least 2 valid options are required";

		if (newErrors.question || newErrors.options) {
			setErrors(newErrors);
			return;
		}

		const validOptions = options
			.filter((o) => o.text.trim() !== "")
			.map((o) => ({ text: o.text.trim() }));

		setErrors({ question: "", options: "" });

		// Fire mutation
		try {
			console.log("📤 Creating poll:", { question, validOptions });
			await mutateAsync({ question, options: validOptions });
			console.log("✅ Poll created, closing modal");
			setOpen(false);
			setQuestion("");
			setOptions([{ id: 1, text: "", votes: 0 }]);
		} catch (err) {
			console.error("❌ Create poll failed:", err);
		}
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
					<Button onClick={handleSubmit} disabled={isPending}>
						{isPending ? "Creating..." : "Create Poll"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
