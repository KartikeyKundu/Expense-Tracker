import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth"
import { createExpense, Filter } from "@/controllers/expense";

export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);

    if (!session){
        // user not logged in 
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }
    if (!session.user.id) return NextResponse.json({message: "No user id"}, {status: 401});

    try{
        // connect to the database
        await connectDB();

        const body = await req.json();

        //Create the expense
        const createdExpense = await createExpense(body, session.user.id);
        
        return NextResponse.json({message: "Expense added", createdExpense}, {status: 201});
    }
    catch (err: any){

        return NextResponse.json({message: err.message || "Internal server error"}, {status: 500});
    }
}

export async function GET(req: NextRequest){
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({message: "Unauthorized"}, {status: 401});
    if (!session.user.id) return NextResponse.json({message: "No user id"}, {status: 401});

    try{
        await connectDB();

        const searchParams = req.nextUrl.searchParams;

        const category = searchParams.get("category");
        const fromParam = searchParams.get("from");
        const toParam = searchParams.get("to");

        const from = fromParam && !isNaN(Date.parse(fromParam)) ? new Date(fromParam) : null;
        const to = toParam && !isNaN(Date.parse(toParam)) ? new Date(toParam) : null;

        const expenses = await Filter(category, from, to, session.user.id);

        return NextResponse.json({expenses}, {status: 200});

    }
    catch (err: any){
        return NextResponse.json({message: err.message || "Internal server error"}, {status: 500});
    }
}