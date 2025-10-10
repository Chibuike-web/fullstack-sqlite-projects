import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";

export default function PollsSignUp() {
	return (
		<main className="grid place-items-center h-screen">
			<div className="shadow-xl bg-foreground/4 rounded-2xl overflow-hidden">
				<div className="w-full max-w-[500px] p-10 bg-white rounded-b-xl border-b border-foreground/10">
					<span className="text-[20px] font-bold text-center">PollSpace</span>
					<p className="text-[20px] font-bold text-foreground mt-6 text-center">
						Create your account
					</p>
					<p className="text-foreground/50 font-medium text-center mt-1">
						Welcome! Please fill in the details to get started
					</p>

					<form className="mt-10" onSubmit={(e) => e.preventDefault()}>
						<div className="flex items-center gap-6 mb-6">
							<div className="">
								<Label htmlFor="firstName" className="flex items-end justify-between mb-2">
									<span className="text-[16px]">First name</span>
									<span className="text-foreground/50 text-[14px]">Optional</span>
								</Label>
								<Input type="text" placeholder="Enter your first name" id="firstName" />
							</div>
							<div>
								<Label htmlFor="lastName" className="flex items-end justify-between mb-2">
									<span className="text-[16px]">Last name</span>
									<span className="text-foreground/50 text-[14px]">Optional</span>
								</Label>
								<Input type="text" placeholder="Enter your last name" id="lastName" />
							</div>
						</div>
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
						<Button className="w-full ring-1 ring-foreground bg-foreground/80">Continue</Button>
					</form>
				</div>
				<div className="py-6 flex gap-2 items-center justify-center">
					<span className="text-foreground/50"> Already have an account?</span>
					<Link to="/polls/sign-in" className="font-medium">
						Sign in
					</Link>
				</div>
			</div>
		</main>
	);
}
