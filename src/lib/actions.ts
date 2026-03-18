"use server";

import { signOut } from "@/auth";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function handleSignOut() {
  await signOut({ redirectTo: "/login" });
}

export async function createTeam(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return;

  const name = formData.get("name") as string;
  const color = formData.get("color") as string;

  if (!name?.trim()) return;

  await db.team.create({
    data: { name, color: color ?? "#6366f1" },
  });

  revalidatePath("/dashboard/teams");
}

export async function createBoard(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return;

  const name = formData.get("name") as string;
  const teamId = formData.get("teamId") as string;

  if (!name?.trim() || !teamId) return;

  await db.board.create({
    data: { name, teamId },
  });

  revalidatePath("/dashboard/boards");
}

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return;

  const title = formData.get("title") as string;
  const boardId = formData.get("boardId") as string;
  const priority = formData.get("priority") as string;

  if (!title?.trim() || !boardId) return;

  const dbUser = await db.user.findUnique({
    where: { email: session.user.email },
  });

  const task = await db.task.create({
    data: {
      title,
      boardId,
      priority: (priority as any) ?? "MEDIUM",
      assigneeId: dbUser?.id,
    },
  });

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

  revalidatePath("/dashboard/tasks");
}

export async function updateTaskStatus(taskId: string, status: string) {
  const session = await auth();
  if (!session?.user?.email) return;

  await db.task.update({
    where: { id: taskId },
    data: { status: status as any },
  });

  revalidatePath("/dashboard/tasks");
}