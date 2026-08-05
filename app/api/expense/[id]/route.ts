import connectDB from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "@/lib/auth"
import { Delete, Update } from "@/controllers/expense";


export async function PUT(req: NextRequest, { params }: { params: Promise <{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) return NextResponse.json({message: "Unauthorized"}, {status: 401});

    try{
        await connectDB();

        const expenseId = (await params).id;
        const body = await req.json();

        const updatedExpense = await Update(body, session.user.id, expenseId);

        return NextResponse.json({message: "Updated Successfully", updatedExpense}, {status: 200});
    }
    catch (err: any){
        return NextResponse.json({message: err.message || "Internal server error"}, {status: 500});
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise <{ id: string }> }){
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) return NextResponse.json({message: "Unauthorized"}, {status: 401});

    try{
        await connectDB();

        const expenseId = (await params).id;

        const deletedExpense = await Delete(session.user.id, expenseId);

        return NextResponse.json({message: "Deleted Successfully", deletedExpense}, {status: 200});
    }
    catch (err: any){
        return NextResponse.json({message: err.message || "Internal server error"}, {status: 500});
    }


}