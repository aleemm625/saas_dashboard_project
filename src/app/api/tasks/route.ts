import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, boardId, priority, assigneeId } = await req.json();
  if (!title || !boardId) {
    return NextResponse.json({ error: "Title and boardId are required" }, { status: 400 });
  }

  const dbUser = await db.user.findUnique({
    where: { email: session.user.email },
  });

  const task = await db.task.create({
    data: {
      title,
      boardId,
      priority: priority ?? "MEDIUM",
      assigneeId: assigneeId ?? dbUser?.id,
    },
  });

  // Log activity
  if (dbUser) {
    await db.activityLog.create({
      data: {
        userId: dbUser.id,
        action: "created",
        target: title,
        taskId: task.id,
      },
    });
  }

  return NextResponse.json(task);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: "Id and status are required" }, { status: 400 });
  }

  const task = await db.task.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(task);
}