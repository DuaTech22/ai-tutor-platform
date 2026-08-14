import Notification from "../models/Notification.js";

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch notifications" });
  }
}

export async function getUnreadCount(req, res) {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch unread count" });
  }
}

export async function markAllRead(req, res) {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true },
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Could not update notifications" });
  }
}

// Helper used internally by other controllers to create a notification
export async function createNotification(userId, message, type = "info") {
  try {
    await Notification.create({ user: userId, message, type });
  } catch (err) {
    console.error("Could not create notification:", err);
  }
}
