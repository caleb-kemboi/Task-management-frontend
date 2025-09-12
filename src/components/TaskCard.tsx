interface Task {
  id: number;
  title: string;
  assignee: string;
  description: string;
}

const TaskCard = ({ task }: { task: Task }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-3">
      <h3 className="font-semibold text-gray-800">{task.title}</h3>
      <p className="text-sm text-gray-500">Description: {task.description}</p>
    </div>
  );
};

export default TaskCard;
