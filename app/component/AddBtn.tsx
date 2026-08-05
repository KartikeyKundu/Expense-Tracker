"use client"
import type { Dispatch } from "react"

const AddBtn = ({setMode }: {setMode: Dispatch<0 | 1 | 2>}) => {

  return (
    <button 
      className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold tracking-wide hover:bg-emerald-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out" 
      onClick={()=>{setMode(1)}}
    >
      + Add Expense
    </button>
  )
}

export default AddBtn