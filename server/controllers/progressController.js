import Progress from "../models/Progress.js";

export async function getProgress(req, res) {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId,
    });
    res.json(progress || { completedLessons: [], quizScores: [] });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch progress" });
  }
}

export async function markLessonComplete(req, res) {
  try {
    const { lessonTitle } = req.body;
    const courseId = req.params.courseId;
    const userId = req.user.id;

    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLessons: [lessonTitle],
        quizScores: [],
      });
    } else if (!progress.completedLessons.includes(lessonTitle)) {
      progress.completedLessons.push(lessonTitle);
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update progress" });
  }
}
