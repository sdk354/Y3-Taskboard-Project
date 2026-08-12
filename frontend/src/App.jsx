import React from "react";
import { Routes, Route } from "react-router-dom";
import BoardPage from "./pages/BoardPage";
import TaskDetail from "./pages/TaskDetail";
import NotFound from "./pages/NotFound";
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<BoardPage />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TaskProvider>
  );
}

export default App;
