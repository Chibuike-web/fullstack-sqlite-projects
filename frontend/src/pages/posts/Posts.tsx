import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EllipsisVertical, Send, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState, startTransition, useOptimistic } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Action, Post } from "./types";

function reducer(currentPosts: Post[], action: Action): Post[] {
	switch (action.type) {
		case "add":
			return [action.post, ...currentPosts];
		case "reaction":
			return currentPosts.map((post) =>
				post.id === action.id ? { ...post, status: "reacting" } : post
			);
		case "delete":
			return currentPosts.map((post) =>
				post.id === action.id ? { ...post, status: "deleting" } : post
			);
		case "edit":
			return currentPosts.map((post) =>
				post.id === action.id ? { ...post, status: "editing" } : post
			);
		default:
			return currentPosts;
	}
}

export default function Posts() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [content, setContent] = useState("");
	const [editId, setEditId] = useState("");
	const [editContent, setEditContent] = useState("");
	const [errors, setErrors] = useState({
		fetch: "",
		add: "",
		edit: "",
		delete: "",
		reaction: "",
	});

	const clearErrors = () => setErrors({ fetch: "", add: "", edit: "", delete: "", reaction: "" });

	const [optimisticPosts, setOptimisticPosts] = useOptimistic<Post[], Action>(posts, reducer);

	const [isPending, setIsPending] = useState<"add" | null>(null);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const res = await fetch("http://localhost:3291/posts");
				if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
				const data = await res.json();
				setPosts(data);
			} catch (err) {
				console.error("Unable to fetch posts:", err);
				setErrors((prev) => ({ ...prev, fetch: "Unable to fetch posts" }));
			}
		}

		fetchPosts();
	}, []);

	async function addPost() {
		clearErrors();
		if (!content.trim()) return;

		const newPost: Post = { id: "temp", content, likes: 0, dislikes: 0 };

		setIsPending("add");
		startTransition(async () => {
			setOptimisticPosts({ type: "add", post: newPost });
			try {
				const res = await fetch("http://localhost:3291/posts", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newPost),
				});

				const data = await res.json();

				if (!res.ok) {
					setErrors((prev) => ({ ...prev, add: data.error }));
				}
				setPosts([data, ...posts]);
				setIsPending(null);
				setContent("");
			} catch (err) {
				console.error(err);
				setIsPending(null);
				setErrors((prev) => ({ ...prev, add: "Failed to create post" }));
			}
		});
	}

	async function handleReaction(postId: string, type: "like" | "dislike") {
		clearErrors();

		const post = posts.find((p) => p.id === postId);
		if (!post) return;

		startTransition(async () => {
			setOptimisticPosts({ type: "reaction", id: postId });
			const newLikes = type === "like" ? (post.likes === 1 ? 0 : 1) : 0;
			const newDislikes = type === "dislike" ? (post.dislikes === 1 ? 0 : 1) : 0;
			try {
				const res = await fetch(`http://localhost:3291/posts/${postId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ likes: newLikes, dislikes: newDislikes }),
				});

				const data = await res.json();
				setPosts((prev) => prev.map((p) => (p.id === postId ? data.updated : p)));

				if (!res.ok) {
					throw new Error(data.error);
				}
			} catch (err) {
				console.error("Issue editing post", err);
				setErrors((prev) => ({ ...prev, reaction: "Failed to update reaction" }));
			}
		});
	}

	async function deletePost(postId: string) {
		clearErrors();
		startTransition(async () => {
			setOptimisticPosts({ type: "delete", id: postId });
			try {
				const res = await fetch(`http://localhost:3291/posts/${postId}`, {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
				});

				const data = await res.json();
				if (!res.ok) {
					setErrors((prev) => ({ ...prev, delete: data.error }));
					throw new Error("Issue deleting post");
				}
				setPosts((prev) => prev.filter((p) => p.id !== postId));
				console.log(data.message);
			} catch (err) {
				console.error("Issue delete post with ID:", postId, err);
				setErrors((prev) => ({ ...prev, delete: "Failed to delete post" }));
			}
		});
	}

	async function editPost(postId: string) {
		clearErrors();
		if (!editContent.trim()) return;

		startTransition(async () => {
			setOptimisticPosts({ type: "edit", id: postId, content: editContent });
			try {
				const res = await fetch(`http://localhost:3291/posts/${postId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ content: editContent }),
				});
				const data = await res.json();
				if (!res.ok) {
					setErrors((prev) => ({ ...prev, edit: data.error }));
					throw new Error("Issue editing post");
				}
				setEditId("");
				setEditContent("");
				setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, content: editContent } : p)));
			} catch (err) {
				console.error("Issue editing post", err);
				setErrors((prev) => ({ ...prev, edit: "Failed to edit post" }));
			}
		});
	}

	return (
		<div className="max-w-xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Mini Social Feed</h1>
			{errors.fetch && <p className="text-red-500 font-medium">{errors.fetch}</p>}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					addPost();
				}}
				className="max-w-[650px] overflow-hidden border bg-background rounded-[14px] flex items-start w-full justify-between px-3 py-3"
			>
				<Textarea
					placeholder="What do u wanna post today ?"
					value={content}
					className="border-none shadow-none outline-none focus-visible:ring-0 resize-none p-0"
					onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
				/>
				<Button className="size-8 rounded-full" disabled={isPending === "add"}>
					<Send />
				</Button>
			</form>
			<ul className="flex flex-col gap-6 mt-6">
				{optimisticPosts.map((post) => (
					<li
						key={post.id}
						className={cn(
							"flex flex-col gap-2 p-4 rounded-[1rem] border bg-white",
							isPending === "add" || post.status === "reacting" || post.status === "deleting"
								? "opacity-70"
								: ""
						)}
					>
						<div className="flex items-center justify-between ">
							<div className="flex items-center gap-1.5">
								<span className="block size-5 bg-primary rounded-full" /> <span>Chibuike</span>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button>
										<EllipsisVertical className="size-4" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => {
											setEditId(post.id);
											setEditContent(post.content);
										}}
									>
										Edit Post
									</DropdownMenuItem>
									<Dialog>
										<DialogTrigger asChild>
											<DropdownMenuItem
												onSelect={(event) => {
													event.preventDefault();
												}}
											>
												Delete Post
											</DropdownMenuItem>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Delete Post</DialogTitle>
												<DialogDescription>
													Are you sure you want to delete this post? This action cannot be undone.
												</DialogDescription>
											</DialogHeader>
											<DialogFooter>
												<DialogClose asChild>
													<Button variant="outline">Cancel</Button>
												</DialogClose>
												<DialogClose asChild>
													<Button variant="destructive" onClick={() => deletePost(post.id)}>
														Delete
													</Button>
												</DialogClose>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						{editId === post.id ? (
							<div className="flex flex-col">
								<Textarea
									value={editContent}
									className="border border-transparent shadow-none outline-none focus:border focus:border-primary focus-visible:ring-0 focus-visible:ring-primary/50 resize-none p-2"
									onInput={(e) => setEditContent((e.target as HTMLTextAreaElement).value)}
								/>
								<div className="flex items-center gap-2 mt-4">
									<Button
										onClick={() => {
											clearErrors();
											editPost(post.id);
										}}
									>
										Save
									</Button>
									<Button variant="outline" onClick={() => setEditId("")}>
										Cancel
									</Button>
								</div>
								{post.status && post.status === "editing" && (
									<p className="text-sm text-gray-500 animate-pulse mt-2">
										Editing post: {post.content}
									</p>
								)}
								{editId === post.id && errors.edit && (
									<p className="text-red-500 font-medium mt-2">{errors.edit}</p>
								)}
							</div>
						) : (
							<>
								<p className="text-[18px] font-medium">{post.content}</p>

								<div className="flex items-center gap-3 text-sm">
									<button
										className="flex items-center gap-1"
										onClick={() => handleReaction(post.id, "like")}
									>
										<span className="flex items-center justify-center">
											<ThumbsUp className={cn("size-4", post.likes && "fill-black")} />
										</span>
										<span>{post.likes}</span>
									</button>
									<button
										className="flex items-center gap-1"
										onClick={() => handleReaction(post.id, "dislike")}
									>
										<span className="flex items-center justify-center">
											<ThumbsDown className={cn("size-4", post.dislikes && "fill-black")} />
										</span>
										<span>{post.dislikes}</span>
									</button>
								</div>
								{post.status && post.status === "deleting" && (
									<p className="text-sm text-gray-500 animate-pulse">
										Deleting post: {post.content}
									</p>
								)}
							</>
						)}
					</li>
				))}
			</ul>
			{errors.add && <p className="text-red-500 font-medium mt-2">{errors.add}</p>}
			{errors.reaction && <p className="text-red-500 font-medium mt-2">{errors.reaction}</p>}
			{errors.delete && <p className="text-red-500 font-medium mt-2">{errors.delete}</p>}
		</div>
	);
}
