export async function fetchPolls() {
	const res = await fetch("http://localhost:3291/polls", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	});

	if (!res.ok) throw new Error("Failed to fetch polls");
	return res.json();
}
