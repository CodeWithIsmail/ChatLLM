import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messages } = body;

    const existingChat = await prisma.chat.findUnique({
      where: {
        id: params.id,
      },
    });

    if (existingChat && existingChat.userId !== user.id) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!existingChat) {
      await prisma.chat.create({
        data: {
          id: params.id,
          userId: user.id,
          title: null,
        },
      });
    }

    // Delete existing messages and create new ones
    await prisma.message.deleteMany({
      where: { chatId: params.id },
    });

    const createdMessages = await prisma.message.createMany({
      data: messages.map((msg: any) => ({
        id: msg.id,
        chatId: params.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
      })),
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      message: "Messages saved successfully",
      count: createdMessages.count,
    });
  } catch (error) {
    console.error("Save messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
