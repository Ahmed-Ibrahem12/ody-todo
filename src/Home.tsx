import React, { useEffect, useState } from "react";

interface ChildProps {
  name: string;
  age: number;
  color?: string;
}

type data = {
  id: number;
  name: string;
  date: string;
  status: boolean;
};

const Home: React.FC<ChildProps> = () => {
  const [tasks, setTasks] = useState<data[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [taskName, setTaskName] = useState<string>("");
  const [taskDate, setTaskDate] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addOrEditTask = () => {
    if (!taskName.trim() || taskDate === "") return;

    if (editingTaskId !== null) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? { ...task, name: taskName, date: taskDate, status: taskStatus }
            : task,
        ),
      );
      setEditingTaskId(null);
    } else {
      setTasks((prev) => [
        ...prev,
        { id: Date.now(), name: taskName, date: taskDate, status: taskStatus },
      ]);
    }

    setTaskName("");
    setTaskDate("");
    setTaskStatus(false);
  };

  const deletTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const editTask = (task: data) => {
    setTaskName(task.name);
    setTaskDate(task.date);
    setTaskStatus(task.status);
    setEditingTaskId(task.id);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: !task.status } : task,
      ),
    );
  };

  const filteredTasks = tasks.filter((t) =>
    t.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3">
      <div className="w-full max-w-6xl bg-gray-200 flex flex-col rounded-2xl p-4 md:p-6">
        <h1 className="text-3xl font-bold text-gray-800 m-auto mb-5">
          Todo App
        </h1>
        {/* Top Cards */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="bg-white rounded-lg px-4 py-3 flex justify-between items-center w-full">
            <div>
              <p className="text-gray-600">All Tasks</p>
              <h2 className="text-2xl font-bold text-blue-400">
                {tasks.length}
              </h2>
            </div>
            <i className="fa-solid fa-list text-blue-400 text-xl"></i>
          </div>

          <div className="bg-white rounded-lg px-4 py-3 flex justify-between items-center w-full">
            <div>
              <p className="text-gray-600">Completed</p>
              <h2 className="text-2xl font-bold text-green-400">
                {tasks.filter((t) => t.status).length}
              </h2>
            </div>
            <i className="fa-solid fa-check text-green-400 text-xl"></i>
          </div>

          <div className="bg-white rounded-lg px-4 py-3 flex justify-between items-center w-full">
            <div>
              <p className="text-gray-600">Pending</p>
              <h2 className="text-2xl font-bold text-orange-400">
                {tasks.filter((t) => !t.status).length}
              </h2>
            </div>
            <i className="fa-solid fa-clock text-orange-400 text-xl"></i>
          </div>
        </div>

        <div className="h-2 bg-white rounded my-5"></div>

        {/* Add Task */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full md:w-1/3 h-12 rounded-full px-3 border border-red-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            className="w-full md:w-1/3 h-12 rounded-full px-3 border border-red-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={addOrEditTask}
            className="w-full md:w-auto bg-red-400 text-white px-5 py-3 rounded-full hover:bg-red-500 transition"
          >
            {editingTaskId !== null ? "Edit Task" : "Add Task"}
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-3 mt-5">
          <input
            type="search"
            placeholder="Search tasks..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full h-12 rounded-full px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-5">
          <table className="w-full bg-white rounded-2xl shadow-md min-w-[600px]">
            <thead>
              <tr className="text-left">
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={
                          item.status
                            ? "bg-green-300 px-2 py-1 rounded-full text-xs"
                            : "bg-orange-300 px-2 py-1 rounded-full text-xs"
                        }
                      >
                        {item.status ? "Completed" : "Pending"}
                      </span>
                    </td>

                    <td className="py-3 px-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleTask(item.id)}
                        className="bg-green-400 cursor-pointer text-white px-2 py-1 text-xs rounded-full"
                      >
                        Toggle
                      </button>

                      <button
                        onClick={() => editTask(item)}
                        className="bg-yellow-400 cursor-pointer text-white px-2 py-1 text-xs rounded-full"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deletTask(item.id)}
                        className="bg-red-400 cursor-pointer text-white px-2 py-1 text-xs rounded-full"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
