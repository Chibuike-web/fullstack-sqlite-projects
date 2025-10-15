import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, type FormData } from "../lib/schemas/authSchema";
import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useToggleVisibility } from "../lib/hooks/use-toggle-visibility";

export default function PollssignUp() {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({ resolver: zodResolver(authSchema) });
	const [signUpError, setSignUpError] = useState("");
	const { toggleVisibility, handleToggleVisibility } = useToggleVisibility();
	const navigate = useNavigate();

	const onSubmit = async (data: FormData) => {
		try {
			const res = await fetch("http://localhost:3291/polls/sign-up", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const resData = await res.json();

			if (!res.ok) {
				if (res.status === 400) {
					const error = resData.error;
					setSignUpError(error);
					return;
				} else if (res.status === 409) {
					const error = resData.error;
					setSignUpError(error);
					setTimeout(() => {
						navigate("/polls/sign-in");
						reset();
					}, 1000);
					return;
				} else {
					setSignUpError(resData.error || "Something went wrong");
				}
				return;
			}
			reset();
			navigate("/polls/sign-in");
		} catch (err) {
			console.error("Issue registering user:", err);
			setSignUpError("Something went wrong. Please try again.");
		}
	};

	return (
		<main className="grid place-items-center min-h-screen px-6 xl:px-0 bg-white">
			<div className="shadow-xl bg-accent rounded-2xl overflow-hidden my-20 border-2 border-accent">
				<div className="w-full max-w-[500px] p-8 md:p-10 bg-white rounded-xl ring-2 ring-accent">
					<span className="text-[20px] font-bold text-center block">PollSpace</span>
					<p className="text-[18px] font-bold text-foreground mt-6 text-center">
						Create your account
					</p>
					<p className="text-foreground/50 font-medium text-center mt-1">
						Welcome! Please fill in the details to get started
					</p>
					{signUpError && (
						<div className="flex justify-between items-center gap-2 px-3 py-2 my-4 bg-red-100 text-red-700 text-sm font-medium rounded-md border border-red-200 shadow-sm">
							{signUpError}
							<button type="button" onClick={() => setSignUpError("")} className="text-red-700">
								<X size={20} />
							</button>
						</div>
					)}
					<form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col items-start md:flex-row md:items-center gap-6 mb-6">
							<div className="flex flex-col w-full">
								<Label htmlFor="firstName" className="flex items-end justify-between mb-2">
									<span className="text-[16px]">First name</span>
									<span className="text-foreground/50 text-[14px]">Optional</span>
								</Label>
								<Input
									type="text"
									placeholder="Enter your first name"
									id="firstName"
									{...register("firstName")}
									aria-describedby={errors.firstName ? "first-name-error" : undefined}
									aria-invalid={!!errors.firstName}
								/>
								{errors.firstName && (
									<p id="first-name-error" className="text-red-500 text-[14px] mt-1">
										{errors.firstName.message}
									</p>
								)}
							</div>
							<div className="flex flex-col w-full">
								<Label htmlFor="lastName" className="flex items-end justify-between mb-2">
									<span className="text-[16px]">Last name</span>
									<span className="text-foreground/50 text-[14px]">Optional</span>
								</Label>
								<Input
									type="text"
									placeholder="Enter your last name"
									id="lastName"
									{...register("lastName")}
									aria-describedby={errors.lastName ? "last-name-error" : undefined}
									aria-invalid={!!errors.lastName}
								/>
								{errors.lastName && (
									<p id="last-name-error" className="text-red-500 text-[14px] mt-1">
										{errors.lastName.message}
									</p>
								)}
							</div>
						</div>
						<div className="mb-6">
							<Label htmlFor="email" className="flex text-[16px] items-end justify-between mb-2">
								Email
							</Label>
							<Input
								type="email"
								placeholder="Enter your email address"
								id="email"
								{...register("email")}
								aria-describedby={errors.email ? "email-error" : undefined}
								aria-invalid={!!errors.email}
							/>
							{errors.email && (
								<p id="email-error" className="text-red-500 text-[14px] mt-1">
									{errors.email.message}
								</p>
							)}
						</div>
						<div className="mb-10">
							<Label htmlFor="password" className="flex text-[16px] items-end justify-between mb-2">
								Password
							</Label>
							<div className="relative">
								<Input
									type={toggleVisibility ? "text" : "password"}
									id="password"
									{...register("password")}
									placeholder="Enter your password"
									aria-describedby={errors.password ? "password-error" : undefined}
									aria-invalid={!!errors.password}
								/>
								<button
									type="button"
									onClick={handleToggleVisibility}
									aria-label={toggleVisibility ? "Hide password" : "Show password"}
									aria-pressed={toggleVisibility}
									className="absolute right-2 top-1/2 -translate-y-1/2"
								>
									{toggleVisibility ? (
										<EyeOff className="size-4" aria-hidden="true" />
									) : (
										<Eye className="size-4" aria-hidden="true" />
									)}
								</button>
							</div>
							{errors.password && (
								<p id="password-error" className="text-red-500 text-[14px] mt-1">
									{errors.password.message}
								</p>
							)}
						</div>
						<Button
							className="w-full disabled:opacity-50"
							type="submit"
							disabled={isSubmitting}
							aria-busy={isSubmitting}
						>
							{isSubmitting ? (
								<span className="flex items-center gap-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									Signing up...
								</span>
							) : (
								"Continue"
							)}
						</Button>
					</form>
				</div>
				<div className="py-6 flex gap-2 items-center justify-center">
					<span className="text-foreground/50">Don’t have an account?</span>
					<Link to="/polls/sign-in" className="font-medium">
						Sign in
					</Link>
				</div>
			</div>
		</main>
	);
}
