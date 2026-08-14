import Discussion from "../models/Discussion.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";

export async function getDiscussions(req, res) {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch discussions" });
  }
}

export async function createDiscussion(req, res) {
  try {
    const { title, body, tag, course } = req.body;
    const user = await User.findById(req.user.id);

    const discussion = await Discussion.create({
      user: req.user.id,
      userName: user.name,
      title,
      body,
      tag: tag || "General",
      course: course || undefined,
    });

    res.status(201).json(discussion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create discussion" });
  }
}

export async function addReply(req, res) {
  try {
    const { body } = req.body;
    const user = await User.findById(req.user.id);

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion)
      return res.status(404).json({ error: "Discussion not found" });

    discussion.replies.push({ user: req.user.id, userName: user.name, body });
    await discussion.save();

    res.json(discussion);

    if (String(discussion.user) !== String(req.user.id)) {
      createNotification(
        discussion.user,
        `${user.name} replied to your discussion "${discussion.title}".`,
        "forum",
      );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add reply" });
  }
}

// Only the discussion's original author, or an admin, can delete it
export async function deleteDiscussion(req, res) {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion)
      return res.status(404).json({ error: "Discussion not found" });

    const isOwner = String(discussion.user) === String(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ error: "You can only delete your own discussions" });
    }

    await Discussion.findByIdAndDelete(req.params.id);
    res.json({ message: "Discussion deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete discussion" });
  }
}
