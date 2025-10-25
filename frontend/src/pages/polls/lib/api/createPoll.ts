import type { PollType } from "../types/pollType";

export async function createPoll(data: PollType) {
	const res = await fetch("http://localhost:3291/polls", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
		credentials: "include",
	});

	if (!res.ok) throw new Error("Failed to create poll");
	return res.json();
}
