import mongoose, { Schema, models } from "mongoose";

const ExpenseSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: ["Food", "Travel", "Shopping", "Groceries", "Bills", "Fees", "Healthcare", "Entertainment", "Other"],
    },

    label: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Expense || mongoose.model("Expense", ExpenseSchema);
