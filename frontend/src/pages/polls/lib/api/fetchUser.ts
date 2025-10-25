export async function fetchUser() {
	const res = await fetch("http://localhost:3291/polls/user", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	});

	if (!res.ok) throw new Error("Failed to fetch user");
	return res.json();
}
