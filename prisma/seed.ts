import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const db = new PrismaClient({ adapter });

async function main() {
  // Create users
  const alex = await db.user.upsert({
    where: { email: "alex@example.com" },
    update: {},
    create: { name: "Alex Smith", email: "alex@example.com", role: "ADMIN" },
  });

  const jamie = await db.user.upsert({
    where: { email: "jamie@example.com" },
    update: {},
    create: { name: "Jamie Kim", email: "jamie@example.com", role: "MEMBER" },
  });

  const morgan = await db.user.upsert({
    where: { email: "morgan@example.com" },
    update: {},
    create: { name: "Morgan R.", email: "morgan@example.com", role: "MEMBER" },
  });

  // Create teams
  const engineering = await db.team.upsert({
    where: { id: "team-engineering" },
    update: {},
    create: { id: "team-engineering", name: "Engineering", color: "#6366f1" },
  });

  const design = await db.team.upsert({
    where: { id: "team-design" },
    update: {},
    create: { id: "team-design", name: "Design", color: "#f59e0b" },
  });

  const marketing = await db.team.upsert({
    where: { id: "team-marketing" },
    update: {},
    create: { id: "team-marketing", name: "Marketing", color: "#10b981" },
  });

  // Add members to teams
  await db.teamMember.createMany({
    skipDuplicates: true,
    data: [
      { userId: alex.id, teamId: engineering.id },
      { userId: jamie.id, teamId: engineering.id },
      { userId: morgan.id, teamId: marketing.id },
    ],
  });

  // Create boards
  const roadmap = await db.board.create({
    data: { name: "Product Roadmap", teamId: engineering.id },
  });

  const sprint = await db.board.create({
    data: { name: "Sprint #14", teamId: engineering.id },
  });

  const uiBoard = await db.board.create({
    data: { name: "UI Redesign", teamId: design.id },
  });

  // Create tasks
  await db.task.createMany({
    data: [
      { title: "Design system tokens", boardId: roadmap.id, status: "DONE", priority: "HIGH", assigneeId: alex.id },
      { title: "Auth flow implementation", boardId: roadmap.id, status: "IN_PROGRESS", priority: "HIGH", assigneeId: jamie.id },
      { title: "Database schema v2", boardId: sprint.id, status: "TODO", priority: "MEDIUM", assigneeId: morgan.id },
      { title: "API rate limiting", boardId: sprint.id, status: "IN_PROGRESS", priority: "LOW", assigneeId: alex.id },
      { title: "Onboarding screens", boardId: uiBoard.id, status: "TODO", priority: "HIGH", assigneeId: morgan.id },
      { title: "Dark mode toggle", boardId: uiBoard.id, status: "DONE", priority: "MEDIUM", assigneeId: jamie.id },
    ],
  });

  // Create activity logs
  await db.activityLog.createMany({
    data: [
      { userId: alex.id, action: "completed", target: "Design system tokens" },
      { userId: jamie.id, action: "started", target: "Auth flow implementation" },
      { userId: morgan.id, action: "created", target: "Onboarding screens" },
    ],
  });

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });