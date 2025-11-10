export async function vote(optionId: number, pollId: string, userId: string) {
	const res = await fetch(`http://localhost:3291/polls/vote/${pollId}/${optionId}`, {
		method: "POST",
		headers: { "Content-Type": "application/json", Authorization: userId },
		credentials: "include",
	});

	if (!res.ok) throw new Error("Failed to vote");
	return res.json();
}
