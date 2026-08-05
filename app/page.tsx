"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { ReactNode, useEffect, useState } from "react";
import AddBtn from "./component/AddBtn";
import ExpenseDetail from "./component/ExpenseDetail";
import { redirect } from "next/navigation";

export type ExpenseType = {
  _id: string,
  amount: number,
  category: string,
  label?: string,
  date: Date
}

const categoryColors: Record<string, string> = {
  Shopping: "bg-purple-100 text-purple-700",
  Food: "bg-orange-100 text-orange-700",
  Travel: "bg-blue-100 text-blue-700",
  Groceries: "bg-green-100 text-green-700",
  Bills: "bg-red-100 text-red-700",
  Fees: "bg-yellow-100 text-yellow-700",
  Healthcare: "bg-pink-100 text-pink-700",
  Entertainment: "bg-indigo-100 text-indigo-700",
  Other: "bg-gray-100 text-gray-700",
}

export default function Home() {

  const [mode, setMode] = useState<0 | 1 | 2>(0); // 0-> no add/edit, 1 -> addingExpense, 2-> editingExpense
  const [currEditExpense, setCurrEditExpense] = useState<ExpenseType | null>(null)
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [expenses, setExpenses] = useState<Array<ExpenseType>>([]);
  const [apiError, setApiError] = useState<string>("")
  

  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  
  
  const [tempFilterCategory, setTempFilterCategory] = useState<string>("");
  const [tempFilterDateFrom, setTempFilterDateFrom] = useState<string>("");
  const [tempFilterDateTo, setTempFilterDateTo] = useState<string>("");
  
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const applyFilters = () => {
    setFilterCategory(tempFilterCategory);
    setFilterDateFrom(tempFilterDateFrom);
    setFilterDateTo(tempFilterDateTo);
    setShowFilters(false);
  };

  const cancelFilters = () => {
    setTempFilterCategory(filterCategory);
    setTempFilterDateFrom(filterDateFrom);
    setTempFilterDateTo(filterDateTo);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilterCategory("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setTempFilterCategory("");
    setTempFilterDateFrom("");
    setTempFilterDateTo("");
  };
  
  const updateTotal = (): void=>{
    const total = expenses.reduce((sum, e) => sum = sum+e.amount, 0);
    setTotalAmount(total);
  }
  
  const updateExpenses = async ()=>{
    
    const params = new URLSearchParams();
    if (filterCategory) params.append('category', filterCategory);
    if (filterDateFrom) params.append('from', filterDateFrom);
    if (filterDateTo) params.append('to', filterDateTo);
    
    const queryString = params.toString();
    const url = `/api/expense${queryString ? `?${queryString}` : ''}`;
    
    const newExpenses = await fetch(url);
    if (!newExpenses.ok){
      setApiError((await newExpenses.json()).message);
      return;
    }

    const expenseArray = (await newExpenses.json()).expenses;
    setExpenses(expenseArray);
  }

  const handleDelete = async (_id: string)=>{
    
    const res = await fetch(`/api/expense/${_id}`, {method: "DELETE"});
    const resJson = await res.json();
    
    if (!res.ok){
      setApiError(resJson.message);
      return;
    }

    await updateExpenses();
  }
  const handleEdit = (e: ExpenseType): void=>{
    setMode(2);
    setCurrEditExpense(e);
  }

  useEffect(updateTotal, [expenses]);
  useEffect(()=>{
    updateExpenses();
  }, [filterCategory, filterDateFrom, filterDateTo])

  useEffect(()=>{
    if (apiError){
      const timer = setTimeout(() => {
        setApiError("");
      }, 3000);

      return ()=> clearTimeout(timer);
    }
  }, [apiError])

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight max-md:text-2xl">
                Expense Tracker
              </h1>
              <p className="text-slate-500 mt-1 max-md:text-sm">Manage your finances with ease</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="px-4 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 max-md:text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Add/Edit Form */}
        <div className="flex justify-center">
          {(mode === 0) && <AddBtn setMode={setMode} />}
          {(mode !== 0) && (
            <ExpenseDetail 
              mode={mode} 
              setMode={setMode} 
              currEditExpense={currEditExpense} 
              setCurrEditExpense={setCurrEditExpense} 
              updateExpenses={updateExpenses}
              setApiError={setApiError}
            />
          )}
        </div>

        {/* Total Spending Card */}
        <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between text-wrap">
            <div>
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-1">
                Total Spending
              </p>
              <p className="text-5xl font-bold tracking-tight max-md:text-2xl">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 max-md:hidden">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-emerald-50">
            <span className="text-sm">{expenses.length} transactions</span>
            {(filterCategory || filterDateFrom || filterDateTo) && (
              <span className="text-sm">• Filtered results</span>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-semibold text-slate-700">Filters</span>
              {(filterCategory || filterDateFrom || filterDateTo) && (
                <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>
            <svg 
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFilters && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="flex flex-col">
                  <label htmlFor="filterCategory" className="text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    id="filterCategory"
                    value={tempFilterCategory}
                    onChange={(e) => setTempFilterCategory(e.target.value)}
                    className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Categories</option>
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
                </div>

                {/* Date From Filter */}
                <div className="flex flex-col">
                  <label htmlFor="filterDateFrom" className="text-sm font-semibold text-slate-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    id="filterDateFrom"
                    value={tempFilterDateFrom}
                    onChange={(e) => setTempFilterDateFrom(e.target.value)}
                    className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Date To Filter */}
                <div className="flex flex-col">
                  <label htmlFor="filterDateTo" className="text-sm font-semibold text-slate-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    id="filterDateTo"
                    value={tempFilterDateTo}
                    onChange={(e) => setTempFilterDateTo(e.target.value)}
                    className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-between">
                <div>
                  {(filterCategory || filterDateFrom || filterDateTo) && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-150"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={cancelFilters}
                    className="px-6 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 hover:shadow-lg transition-all duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-slate-500 font-medium">
                          {(filterCategory || filterDateFrom || filterDateTo) ? "No expenses match your filters" : "No expenses yet"}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {(filterCategory || filterDateFrom || filterDateTo) ? "Try adjusting your filter criteria" : "Click 'Add Expense' to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  expenses.map((ele: ExpenseType, idx: number): ReactNode => {
                    return (
                      <tr key={ele._id} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-slate-900 max-md:text-sm">
                            ${ele.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full max-md:text-xs font-semibold ${categoryColors[ele.category] || categoryColors.Other}`}>
                            {ele.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-md:text-xs">
                          {ele.label ? ele.label : (
                            <span className="italic text-slate-400">No label</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium max-md:text-xs">
                          {new Date(ele.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            <button 
                              className="px-4 py-2 text-sm max-md:text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                              onClick={() => handleEdit(ele)}
                            >
                              Edit
                            </button>
                            <button 
                              className="px-4 py-2 text-sm max-md:text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                              onClick={() => handleDelete(ele._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {(apiError && <div className="fixed bottom-2 text-red-500 text-lg left-1/2 translate-[-50%] z-10 bg-slate-300 px-2 rounded-full text-center">{apiError}</div>)}

    </div>
  )
}