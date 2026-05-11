function formatTask(task) {
  return {
    id: String(task._id),
    title: task.title,
    description: task.description || "",
    assignedTo: task.assignedTo?.name || String(task.assignedTo?._id || task.assignedTo),
    assignedToId: String(task.assignedTo?._id || task.assignedTo),
    subject: task.subject,
    dueDate: task.deadline,
    status: task.status,
    priority: task.priority || "medium",
    xp: task.xp,
    completionRate: task.status === "completed" ? 100 : task.status === "in-progress" ? 50 : 0,
  };
}

function getTaskQueryForUser(user) {
  if (user.role === "student") return { assignedTo: user.userId };
  if (user.role === "teacher") return { assignedBy: user.userId };
  return {};
}

module.exports = {
  formatTask,
  getTaskQueryForUser,
};
