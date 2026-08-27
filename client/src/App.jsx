import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import Quiz from "./pages/Quiz.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Study from "./pages/Study.jsx";
import SavedNotes from "./pages/SavedNotes.jsx";
import Forum from "./pages/Forum.jsx";
import CodingAssistant from "./pages/CodingAssistant.jsx";
import Whiteboard from "./pages/Whiteboard.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/courses/:id/quiz" element={<Quiz />} />
      <Route path="/forum" element={<Forum />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/study"
        element={
          <ProtectedRoute>
            <Study />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-notes"
        element={
          <ProtectedRoute>
            <SavedNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/code"
        element={
          <ProtectedRoute>
            <CodingAssistant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/whiteboard"
        element={
          <ProtectedRoute>
            <Whiteboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
