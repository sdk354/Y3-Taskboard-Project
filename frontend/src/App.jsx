import React from "react";
import { Routes, Route } from "react-router-dom";

import BoardPage from "./pages/BoardPage";
import TaskDetail from "./pages/TaskDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

import { TaskProvider } from "./context/TaskContext";
import { AuthProvider } from "./context/AuthContext";

import UndoToast from "./components/UndoToast";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute>
                <TaskDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>

        <UndoToast />
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;