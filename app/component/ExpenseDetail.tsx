"use client"
import { Dispatch } from "react"
import { useForm } from "react-hook-form"
import { ExpenseType } from "../page"

type Inputs = {
  amount: number
  category: string
  label?: string
  date?: string
}


const ExpenseDetail = ({mode, setMode, currEditExpense, setCurrEditExpense, updateExpenses, setApiError}: {mode: 0 | 1 | 2, setMode: Dispatch<0 | 1 | 2>, currEditExpense: ExpenseType | null, setCurrEditExpense: Dispatch<ExpenseType | null>, updateExpenses: Function, setApiError: Dispatch <string>}) => {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Inputs>()

  const onSubmit = async (data: Inputs) => {
    // do we need to update or create new?
    if (mode === 1){
      // create new
      const res = await fetch("/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      const resJson = await res.json();
      
      if (!res.ok){
        setApiError(resJson.message);
        return;
      }

    }
    else if (mode === 2){
      // Update current
      const res = await fetch(`api/expense/${currEditExpense?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      const resJson = await res.json();

      if (!res.ok){
        setApiError(resJson.message);
        return;
      }
    }
    
    await updateExpenses();
    reset();
    setMode(0);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-6xl bg-white rounded-xl shadow-sm border border-slate-200 p-8"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {mode === 1 ? 'Add New Expense' : 'Edit Expense'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Amount */}
        <div className="flex flex-col">
          <label htmlFor="amount" className="text-sm font-semibold text-slate-700 mb-2">
            Amount *
          </label>
          <input
            type="number"
            id="amount"
            className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="0.00"
            autoFocus
            defaultValue={mode === 2 ? currEditExpense!.amount : undefined}
            {...register("amount", {
              required: "Amount is required",
              valueAsNumber: true,
              min: { value: 1, message: "Amount must be greater than 0" },
            })}
          />
          {errors.amount && (
            <span className="text-red-500 text-xs mt-1 font-medium">
              {errors.amount.message}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category" className="text-sm font-semibold text-slate-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            defaultValue={(mode === 2) ? currEditExpense!.category : undefined}
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="">Select category</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Food">🍔 Food</option>
            <option value="Travel">✈️ Travel</option>
            <option value="Groceries">🛒 Groceries</option>
            <option value="Bills">📄 Bills</option>
            <option value="Fees">💳 Fees</option>
            <option value="Healthcare">🏥 Healthcare</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Other">📦 Other</option>
          </select>
          {errors.category && (
            <span className="text-red-500 text-xs mt-1 font-medium">
              {errors.category.message}
            </span>
          )}
        </div>

        {/* Label */}
        <div className="flex flex-col">
          <label htmlFor="label" className="text-sm font-semibold text-slate-700 mb-2">
            Label
          </label>
          <input
            type="text"
            id="label"
            className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="e.g., Lunch with team"
            defaultValue={(mode === 2) ? currEditExpense!.label : undefined}
            {...register("label", {
            })}
          />
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label htmlFor="date" className="text-sm font-semibold text-slate-700 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            defaultValue =  {(mode === 2) ? currEditExpense!.date.toString().split("T")[0] : undefined}
            {...register("date", {
            })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() =>{
            reset();
            setMode(0);
            setCurrEditExpense(null);
          }}
          className="px-6 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 hover:shadow-lg transition-all duration-200"
          disabled={isSubmitting}
        >
          {mode === 1 ? 'Add Expense' : 'Update Expense'}
        </button>
      </div>
    </form>
  )
}

export default ExpenseDetail