import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchExpenses, addExpense, removeExpense } from '../store/slices/expensesSlice';

import { formatCurrency, formatDate } from '../utils/formatters';
import { BiTrash, BiWallet } from 'react-icons/bi';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { ExpenseCategory } from '../types';

const ExpensesPage = () => {
  const dispatch = useAppDispatch();
  const { items: expenses, isLoading } = useAppSelector((state) => state.expenses);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    await dispatch(
      addExpense({
        title,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString(),
      }),
    );
    setTitle('');
    setAmount('');
  };

  const handleDelete = (id: string) => {
    dispatch(removeExpense(id));
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Expenses</h2>
        <div className="glass px-4 py-2 rounded-xl border-indigo-200">
          <span className="text-sm text-slate-500 mr-2">Total:</span>
          <span className="text-lg font-bold text-indigo-700">{formatCurrency(total)}</span>
        </div>
      </div>

      <Card>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <Input
              label="Expense Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Office Lunch"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <Input
              label="Amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="glass-input w-full h-10 px-2"
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full h-10">
              Add
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <BiWallet className="mx-auto h-12 w-12 text-slate-300 mb-2" />
            <p>No expenses recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="pb-3 pl-2">Date</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-2 text-sm text-slate-600 whitespace-nowrap">{formatDate(exp.date)}</td>
                    <td className="py-4 font-medium text-slate-800">{exp.title}</td>
                    <td className="py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-slate-700">{formatCurrency(exp.amount)}</td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-block"
                        title="Delete expense"
                      >
                        <BiTrash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExpensesPage;
