// all controllers for GET request, POST request, PUT and DELETE
import expense from "@/models/expense";
import ExpenseType from "@/lib/expenseInterface";


export async function createExpense(data: ExpenseType, userId: string){
    const { amount, category, label, date } = data;

    if (typeof amount !== "number" || amount <= 0) throw new Error("Invalid amount");

    if (!category) throw new Error("Category Required");

    const newExpense = await expense.create({
        userId,
        amount,
        category,
        label: label || "",
        date: date || Date.now(),
    })

    return newExpense;
}

export async function Filter(category: string | null, from: Date | null, to: Date | null, userId: string){
    // need to fetch for userId
    const query: any = {
        userId,
    }

    if (category) query.category = category;

    if (from || to){
        query.date = {};

        if (from) query.date.$gte = from;

        if (to) query.date.$lte = to;
    }
    
    const foundExpenses = await expense.find(query).sort({date: -1});

    return foundExpenses;
}


export async function Update(data: ExpenseType, userId: string, _id: string){
    // find this expense
    const foundExpense = await expense.findOne({userId, _id});

    if (!foundExpense) throw new Error("Invalid Expense");


    if (data.amount !== undefined) foundExpense.amount = data.amount;
    if (data.category !== undefined) foundExpense.category = data.category;
    if (data.date) foundExpense.date = data.date;
    if (data.label !== undefined) foundExpense.label = data.label;

    await foundExpense.save();

    return foundExpense;
}


export async function Delete(userId: string, _id: string){
    
    const deleted = await expense.findOneAndDelete({userId, _id});

    if (!deleted) throw new Error("No Expense Found");

    return deleted;
}