import { useEffect } from 'react';

import { BiTask, BiWallet, BiTrendingUp } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchTasks } from '../store/slices/tasksSlice';
import { fetchExpenses } from '../store/slices/expensesSlice';
import Card from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';

 const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { items: tasks, isLoading: tasksLoading } = useAppSelector((state) => state.tasks);
  const { items: expenses, isLoading: expensesLoading } = useAppSelector((state) => state.expenses);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchExpenses());
  }, [dispatch]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const isLoading = tasksLoading || expensesLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task Summary Card */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <BiTask className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tasks Completion</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {isLoading ? '...' : `${completedTasks}/${totalTasks}`}
              </h3>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Progress</span>
              <span className="font-medium text-slate-700">{taskProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${taskProgress}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Expense Summary Card */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <BiWallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Expenses</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {isLoading ? '...' : formatCurrency(totalExpenses)}
              </h3>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-auto">Across {expenses.length} records</p>
        </Card>

        {/* Quick Insight Card */}
        <Card className="flex flex-col bg-linear-to-br from-indigo-500 to-purple-600 border-none text-white!">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <BiTrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Quick Insight</p>
              <h3 className="text-xl font-bold text-white">Keep it up!</h3>
            </div>
          </div>
          <p className="text-sm text-white/90 mt-auto leading-relaxed">
            You've completed {completedTasks} tasks recently. Stay productive and mindful of your expenses!
          </p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Tasks</h3>
            {isLoading ? (
               <div className="animate-pulse space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-200 rounded-lg"></div>)}
               </div>
            ) : tasks.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No tasks found.</p>
            ) : (
                <div className="space-y-3">
                    {tasks.slice(0, 3).map(task => (
                        <div key={task.id} className="flex justify-between items-center p-3 rounded-lg bg-white/40 border border-white/50">
                            <div>
                                <p className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high' ? 'bg-rose-100 text-rose-700' : task.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{task.priority}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
         </Card>
         
         <Card>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Expenses</h3>
            {isLoading ? (
               <div className="animate-pulse space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-200 rounded-lg"></div>)}
               </div>
            ) : expenses.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No expenses found.</p>
            ) : (
                <div className="space-y-3">
                    {expenses.slice(0, 3).map(exp => (
                        <div key={exp.id} className="flex justify-between items-center p-3 rounded-lg bg-white/40 border border-white/50">
                            <div>
                                <p className="font-medium text-slate-700">{exp.title}</p>
                                <p className="text-xs text-slate-500 capitalize">{exp.category}</p>
                            </div>
                            <span className="font-bold text-slate-800">{formatCurrency(exp.amount)}</span>
                        </div>
                    ))}
                </div>
            )}
         </Card>
      </div>

    </div>
  );
};

export default DashboardPage;