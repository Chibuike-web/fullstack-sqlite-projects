import { Router } from "express";
import { db } from "../../posts/lib/index";
import { posts } from "../../posts/lib/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (_, res) => {
	try {
		const result = await db.select().from(posts).all();
		res.json(result);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch posts" });
	}
});

router.post("/", async (req, res) => {
	const { content, likes, dislikes } = req.body;

	if (!content?.trim()) {
		return res.status(400).json({ error: "Content is required" });
	}
	try {
		const newPost = await db
			.insert(posts)
			.values({
				content,
				likes,
				dislikes,
			})
			.returning()
			.get();

		res.json(newPost);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to create post" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const postId = req.params.id;

		if (!postId) {
			return res.status(400).json({ message: "Id is missing" });
		}

		const deleted = await db
			.delete(posts)
			.where(eq(posts.id, Number(postId)))
			.returning();

		if (deleted.length === 0) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.json({ message: "Post deleted", deleted });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to delete post" });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const postId = req.params.id;
		const { likes, dislikes, content } = req.body;

		if (!postId) {
			return res.status(400).json({ message: "Id is missing" });
		}

		const updateData: Record<string, string> = {};
		if (content !== undefined) updateData.content = content;
		if (likes !== undefined) updateData.likes = likes;
		if (dislikes !== undefined) updateData.dislikes = dislikes;

		if (Object.keys(updateData).length === 0) {
			return res.status(400).json({ message: "No fields provided to update" });
		}

		const updated = await db
			.update(posts)
			.set(updateData)
			.where(eq(posts.id, Number(postId)))
			.returning();

		if (updated.length === 0) {
			return res.status(400).json({ message: "Post not found" });
		}

		res.json({ message: "Post updated", updated: updated[0] });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to update post" });
	}
});

export default router;
