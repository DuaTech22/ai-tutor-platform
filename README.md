# AI Tutor Platform — Nova

This folder contains the full project: the animated 3D AI tutor "Nova" with
bilingual (English + Roman Urdu) voice and text chat, backed by a Groq/Llama
AI backend — plus authentication, courses, quizzes, certificates, a student
dashboard, and an admin panel.

## Warning: do this before running

The 3D robot model files (scene.gltf and scene.bin) are NOT included
because they're binary files from your computer.

Copy them into:
```
client/public/models/scene.gltf
client/public/models/scene.bin
```
(Delete the PUT_YOUR_ROBOT_MODEL_HERE.txt placeholder once done.)

## Important note on the newer features

Modules 1-9 (landing page, 3D robot, voice assistant, blackboard, AI chat)
were built and tested together interactively - those are solid.

Modules 10+ (Authentication, MongoDB, Courses, Quizzes, Dashboard, Admin
Panel) are included as complete, carefully-written code, but were NOT
run and debugged live the way the earlier modules were. They follow the
same patterns and should work, but if you hit an error when you first run
them, treat it the same way we handled earlier errors: copy the exact
error message from the terminal/browser console and share it, and it can
be fixed the same way.

## How to open and run this in VS Code

1. Open this whole ai-tutor-platform folder in VS Code (File -> Open Folder).
2. Open a terminal (Ctrl+`).

### Set up the backend
```powershell
cd server
npm install
```
Create a .env file in server/ (copy .env.example and rename it to
.env), then fill in your own values:
```
PORT=5000
GROQ_API_KEY=your_actual_groq_key
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string_you_make_up
```
- Groq key (free, no card): https://console.groq.com
- MongoDB Atlas (free tier): https://www.mongodb.com/cloud/atlas - create a
  free cluster, then use "Connect" -> "Drivers" to get your connection string.

Run the backend:
```powershell
npm run dev
```
You should see: `Server running on port 5000` and `MongoDB connected`
(if MongoDB isn't connected, the AI chat/voice features still work - only
auth/courses/quizzes need the database).

### Set up the frontend (open a second terminal)
```powershell
cd client
npm install
npm run dev
```
Visit the printed URL, usually http://localhost:5173.

Both terminals need to stay running at the same time.

## Making your first account an admin

New accounts default to role: "student". To create/manage courses from
the Admin Panel, you need to manually change your role to "admin" in the
database:
1. Register a normal account on the site first.
2. Open MongoDB Atlas -> Browse Collections -> users collection.
3. Find your user document, edit the role field from "student" to
   "admin", save.
4. Log out and log back in on the site so the new role takes effect.

## What's included

Frontend (React + Vite + Tailwind):
- Landing page: animated Hero, 3D robot avatar, blackboard-style AI answer
  panel, floating chat widget, "How It Works" section, feature cards
- Bilingual (English / Roman Urdu) voice + text chat with Nova
- Auth pages: real Login and Register forms wired to the backend
- AuthContext + ProtectedRoute for gated pages
- Student Dashboard (course overview, stats placeholders)
- Courses list page + Course Detail page (lessons, quiz link, certificate
  download button)
- Quiz-taking page with scoring, submitted to the backend
- Admin Panel: create new courses (admin-only)

Backend (Node.js + Express + MongoDB):
- /api/ai/ask - Groq/Llama-powered CS tutor (English + Roman Urdu,
  strictly Computer-Science-only, politely declines off-topic questions)
- /api/ai/speak - bilingual text-to-speech via Microsoft Edge TTS voices
- /api/ai/to-roman - converts Urdu-script speech recognition output into
  Roman Urdu for display
- /api/auth/register, /api/auth/login, /api/auth/me - JWT auth with
  bcrypt password hashing
- /api/courses - full CRUD (create/update/delete are admin-only)
- /api/quizzes - fetch quizzes by course, submit scores (saved to
  each user's Progress record)
- /api/certificates/generate - generates a downloadable PDF certificate

## What's still NOT built (from the original 25-module roadmap)

- Coding Assistant (in-browser code editor + AI code explanation) - Module 10
- Whiteboard / diagram rendering - Module 18
- Notifications system - Module 21
- Production deployment configuration (Vercel/Render/Atlas) - Module 22
- Performance optimization pass (code-splitting, lazy loading) - Module 23
- Security hardening (rate limiting, helmet, input validation) - Module 24
- Final polish / accessibility pass - Module 25

Ask to continue with any of these, one at a time, whenever you're ready.

## Project structure

```
ai-tutor-platform/
|-- client/                      React (Vite) frontend
|   |-- public/models/           3D robot model goes here (see warning above)
|   `-- src/
|       |-- components/          Navbar, Hero, Blackboard, ChatWidget,
|       |                        ChatPanel, VoiceAssistant, TextChat,
|       |                        HowItWorks, ProtectedRoute, robot/
|       |-- context/             AuthContext.jsx
|       |-- pages/               Home, Login, Register, Dashboard, Courses,
|       |                        CourseDetail, Quiz, AdminPanel
|       |-- services/            aiService.js, authService.js, courseService.js
|       `-- utils/               speak.js (fallback browser TTS)
`-- server/                      Node.js/Express backend
    |-- config/                  db.js (MongoDB connection)
    |-- controllers/             aiController, ttsController, authController,
    |                            courseController, quizController,
    |                            certificateController
    |-- middleware/              authMiddleware.js (JWT protect/adminOnly)
    |-- models/                  User, Course, Progress, Quiz
    `-- routes/                  aiRoutes, authRoutes, courseRoutes,
                                 quizRoutes, certificateRoutes
```

## Update: University-level enhancements

This adds four things on top of the base build described above:

1. **Academic design pass** -- serif heading font (Source Serif 4, loaded via
   Google Fonts in `index.html`), toned-down/no-longer-pulsing background
   glows, Blackboard now uses a serif font instead of Comic Sans.
2. **Beginner / Advanced level toggle** -- available both on the `/study`
   page and on the Hero blackboard's mic panel. Sent to the backend as a
   `level` field and folded into the AI's system prompt to control depth.
3. **AI-generated full courses** -- Admin Panel now has a "Generate a Full
   Course with AI" box. Give it a topic and it creates a complete Course
   document (title, description, 4-6 lessons with full markdown notes) via
   `POST /api/generate/course` (admin-only). Course Detail page renders
   each lesson's markdown notes with an expand/collapse per lesson.
4. **Discussion Forum** -- new `/forum` page (link in Navbar, visible to
   everyone; posting/replying requires login). Backend: `Discussion` model,
   `discussionController.js`, `discussionRoutes.js`, mounted at
   `/api/discussions`.

New dependency: `react-markdown` was added to `client/package.json` -- run
`npm install` again in `client/` after pulling this update.

As with the auth/courses/quiz module before, these were written carefully
but not run and debugged live in conversation -- if you hit an error the
first time you try one of these features, share the exact error message
the same way as before and it can be fixed the same way.
