"use client";

import { useState, useEffect } from "react";

// 1. Define what a Task looks like so TypeScript doesn't complain
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  // State for the list of tasks and the input field
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // --- CRUD OPERATIONS ---

  // READ: Fetch all tasks when the page loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // CREATE: Add a new task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    if (!input.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });

    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setInput("");
  };

  // UPDATE: Toggle completion status
  const toggleTask = async (id: number, currentStatus: boolean) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentStatus }),
    });

    if (res.ok) {
      const updatedTask = await res.json();
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    }
  };

  // DELETE: Remove a task
  const deleteTask = async (id: number) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  // --- UI RENDERING ---

  return (
    <main className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center">My Task Manager</h1>

      {/* Input Form */}
      <form onSubmit={addTask} className="flex gap-2 mb-8">
        <input
          type="text"
          className="flex-1 p-3 border rounded shadow-sm text-black focus:outline-blue-500"
          placeholder="What needs to be done?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : (
        <ul className="space-y-4">
          {tasks.length === 0 && <p className="text-gray-400">No tasks yet!</p>}
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-4 bg-white border rounded shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, task.completed)}
                />
                <span className={`text-lg ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                  {task.title}
                </span>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 font-semibold px-2 py-1"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}