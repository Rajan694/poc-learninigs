import { useState } from 'react';
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from '../store/api/expensesApi';

import { formatCurrency, formatDate } from '../utils/formatters';
import { BiTrash, BiWallet, BiEdit } from 'react-icons/bi';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { ExpenseCategory } from '../types';

const ExpensesPage = () => {
  const { data: expenses = [], isLoading, error: queryError } = useGetExpensesQuery();
  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  const error = queryError ? (typeof queryError === 'string' ? queryError : 'An error occurred') : null;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState<ExpenseCategory>('other');

  const startEdit = (expense: any) => {
    setEditingId(expense.id);
    setEditTitle(expense.title);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
  };

  const saveEdit = async () => {
    if (editingId && editTitle.trim() && editAmount) {
      try {
        await updateExpense({
          id: editingId,
          updates: {
            title: editTitle,
            amount: parseFloat(editAmount),
            category: editCategory,
          },
        }).unwrap();
        setEditingId(null);
      } catch {
        // Error state is managed by RTK Query.
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    try {
      await createExpense({
        title,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString(),
      }).unwrap();
      setTitle('');
      setAmount('');
    } catch {
      // Error state is managed by RTK Query.
    }
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
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

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

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
              <tbody className="divide-y divide-white/20">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/40 transition-colors">
                    {editingId === exp.id ? (
                      <td colSpan={5} className="py-2 px-2">
                        <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1"
                            placeholder="Title"
                          />
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value as ExpenseCategory)}
                            className="glass-input w-full sm:w-32 h-10 px-2"
                          >
                            <option value="food">Food</option>
                            <option value="transport">Transport</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="utilities">Utilities</option>
                            <option value="other">Other</option>
                          </select>
                          <Input
                            type="number"
                            step="0.01"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-full sm:w-28"
                            placeholder="Amount"
                          />
                          <div className="flex gap-1">
                            <Button onClick={saveEdit} className="h-10 px-3">
                              Save
                            </Button>
                            <Button variant="outline" onClick={() => setEditingId(null)} className="h-10 px-3">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="py-4 pl-2 text-sm text-slate-600 whitespace-nowrap">{formatDate(exp.date)}</td>
                        <td className="py-4 font-medium text-slate-800">{exp.title}</td>
                        <td className="py-4">
                          <span className="text-xs px-2 py-1 rounded-full bg-white/60 border border-white/80 shadow-sm text-slate-700 capitalize">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-4 text-right font-bold text-slate-700">{formatCurrency(exp.amount)}</td>
                        <td className="py-4 text-center">
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => startEdit(exp)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white/50 rounded-lg transition-colors inline-block"
                              title="Edit expense"
                            >
                              <BiEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(exp.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white/50 rounded-lg transition-colors inline-block"
                              title="Delete expense"
                            >
                              <BiTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
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
