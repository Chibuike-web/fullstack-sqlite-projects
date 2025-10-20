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

export default function PollsSignIn() {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({ resolver: zodResolver(authSchema) });
	const [signInError, setSignInError] = useState("");
	const { toggleVisibility, handleToggleVisibility } = useToggleVisibility();
	const navigate = useNavigate();

	const onSubmit = async (data: FormData) => {
		try {
			const res = await fetch("http://localhost:3291/polls/sign-in", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
				credentials: "include",
			});

			const resData = await res.json();
			if (!res.ok) {
				setSignInError(resData.error);
				navigate("/polls/sign-up");
				return;
			}
			reset();
			navigate("/polls");
		} catch (err) {
			console.error("Issue authenticating user", err);
			setSignInError("Something went wrong. Please try again.");
		}
	};
	return (
		<main className="grid place-items-center min-h-screen px-6 xl:px-0 bg-white">
			<div className="shadow-xl bg-accent rounded-2xl overflow-hidden my-20 border-2 border-accent">
				<div className="w-full max-w-[500px] p-8 md:p-10 bg-white rounded-xl ring-2 ring-accent">
					<span className="tracking-[-0.02em] text-[18px] font-bold text-center block">
						PollSapce
					</span>
					<p className="text-[18px] font-semibold text-foreground mt-6 text-center">
						Sign in to your account
					</p>
					<p className="text-foreground/50 font-medium text-center mt-1">
						Welcome back! Please enter your credentials to continue
					</p>
					{signInError && (
						<div className="flex justify-between items-center gap-2 px-3 py-2 my-4 bg-red-100 text-red-700 text-sm font-medium rounded-md border border-red-200 shadow-sm">
							{signInError}
							<button type="button" onClick={() => setSignInError("")} className="text-red-700">
								<X size={20} />
							</button>
						</div>
					)}
					<form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
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
									Signing in...
								</span>
							) : (
								"Sign in"
							)}
						</Button>{" "}
					</form>
				</div>
				<div className="py-6 flex gap-2 items-center justify-center">
					<span className="text-foreground/50">Don’t have an account?</span>
					<Link to="/polls/sign-up" className="font-medium">
						Sign up
					</Link>
				</div>
			</div>
		</main>
	);
}
