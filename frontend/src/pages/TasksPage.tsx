import { useState } from 'react';
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../store/api/tasksApi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { BiTrash, BiCheckCircle, BiCircle, BiEdit } from 'react-icons/bi';
import type { Task } from '../types';

const TasksPage = () => {
  const { data: tasks = [], isLoading, error: queryError } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const error = queryError ? (typeof queryError === 'string' ? queryError : 'An error occurred') : null;
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  const saveEdit = async () => {
    if (editingId && editTitle.trim()) {
      try {
        await updateTask({ id: editingId, updates: { title: editTitle, priority: editPriority } }).unwrap();
        setEditingId(null);
      } catch {
        // Error state is managed by RTK Query.
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title,
        description: '',
        status: 'pending',
        priority,
        dueDate: new Date().toISOString(),
      }).unwrap();
      setTitle('');
    } catch {
      // Error state is managed by RTK Query.
    }
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateTask({ id, updates: { status: currentStatus === 'pending' ? 'completed' : 'pending' } });
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800">Tasks</h2>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      <Card>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input
              label="New Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div className="w-full sm:w-32">
            <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="glass-input w-full h-10"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <Button type="submit" className="w-full sm:w-auto h-10">
            Add Task
          </Button>
        </form>
      </Card>

      <Card>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <BiCheckCircle className="mx-auto h-12 w-12 text-slate-300 mb-2" />
            <p>No tasks yet. You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border transition-all ${
                  task.status === 'completed'
                    ? 'bg-white/30 backdrop-blur-sm border-white/40 opacity-70'
                    : 'glass-card hover:shadow-md'
                }`}
              >
                {editingId === task.id ? (
                  <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="flex-1" />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="glass-input w-full sm:w-32 h-10 px-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button onClick={saveEdit} className="h-10 px-4">
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingId(null)} className="h-10 px-4">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => toggleStatus(task.id, task.status)}
                      className="text-indigo-600 hover:text-indigo-800 flex-shrink-0"
                    >
                      {task.status === 'completed' ? (
                        <BiCheckCircle className="h-6 w-6" />
                      ) : (
                        <BiCircle className="h-6 w-6" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 w-full">
                      <p
                        className={`font-medium truncate ${
                          task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                          task.priority === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex gap-1 flex-shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => startEdit(task)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <BiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <BiTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TasksPage;
