import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";

export default function PollSignIn() {
	return (
		<main className="grid place-items-center h-screen">
			<div className="shadow-xl bg-foreground/4 rounded-2xl overflow-hidden">
				<div className="w-full max-w-[500px] p-10 bg-white rounded-b-xl border-b border-foreground/10">
					<h1 className="text-[20px] font-bold text-center">PollSpace</h1>
					<p className="text-[20px] font-bold text-foreground mt-6 text-center">
						Sign in to your account
					</p>
					<p className="text-foreground/50 font-medium text-center mt-1">
						Welcome back! Please enter your credentials to continue
					</p>

					<form className="mt-10" onSubmit={(e) => e.preventDefault()}>
						<div className="mb-6">
							<Label htmlFor="email" className="flex text-[16px] items-end justify-between mb-2">
								Email
							</Label>
							<Input type="email" placeholder="Enter your email address" id="email" />
						</div>
						<div className="mb-10">
							<Label htmlFor="password" className="flex text-[16px] items-end justify-between mb-2">
								Password
							</Label>
							<Input type="password" placeholder="Enter your password" id="password" />
						</div>
						<Button className="w-full ring-1 ring-foreground bg-foreground/80">Sign in</Button>
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
