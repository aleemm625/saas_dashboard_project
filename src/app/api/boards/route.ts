import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, teamId } = await req.json();
  if (!name || !teamId) {
    return NextResponse.json({ error: "Name and teamId are required" }, { status: 400 });
  }

  const board = await db.board.create({
    data: { name, teamId },
  });

  return NextResponse.json(board);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boards = await db.board.findMany({
    include: {
      team: true,
      _count: { select: { tasks: true } },
    },
  });

  return NextResponse.json(boards);
}