export function formatTime(time: number) {
	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "long",
		timeStyle: "short",
	}).format(new Date(time));
}

export function formatDuration(ms: number) {
	const totalSeconds = Math.floor(ms / 1000);

	const days = Math.floor(totalSeconds / (24 * 3600));
	const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
