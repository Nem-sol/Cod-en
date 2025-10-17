export const runtime = "nodejs";

import connect from "@/src/utils/db";
import { getToken } from "next-auth/jwt";
import Inbox from "../../../models/Inbox";
import { NextResponse } from "next/server";
import Project from "../../../models/Project";

export async function GET(req) {
  await connect();

  if (!global.io) {
    console.log("Starting Socket.IO server (Next 15 + Node runtime)");

    const { Server } = await import("socket.io");
    global.io = new Server({
      path: "/api/socket",
      cors: { origin: "*" },
    });

    global.io.on("connection", async (socket) => {
      console.log("Socket connected:", socket.id);

      try {
        const cookieHeader = socket.handshake.headers.cookie || "";
        const token = await getToken({
          req: { headers: { cookie: cookieHeader } },
          secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
          socket.disconnect(true);
          return NextResponse.json({error: "Unauthorized socket attempt"}, {status: 401});
        }

        const userId = token.id;
        const role = token.role || "user";
        const isAdmin = role === "admin";

        const projects = await Project.find(isAdmin ? {} : { userId }).select("_id");
        projects.forEach((p) => socket.join(`project:${p._id}`));

        const inboxes = await Inbox.find({
          projectId: { $in: projects.map((p) => p._id) },
        }).select("_id");
        inboxes.forEach((i) => socket.join(`inbox:${i._id}`));

        socket.on("send-message", async ({ inboxId, message }) => {
          const inbox = await Inbox.findById(inboxId);
          if (!inbox) return;
          inbox.messages.push(message);
          await inbox.save();
          global.io.to(`inbox:${inboxId}`).emit("new-message", { ...message, inboxId });
        });

        socket.on('read-message', async ({ inboxId }) => {
          const inbox = await Inbox.findById(inboxId)
          if ( !inbox || !inboxId ) return
          await Inbox.findByIdAndUpdate( inboxId , {
            messages: [...inbox.messages.map((msg)=>{ return token.id === inbox.userId ?
              !msg.sent ? {...msg, read: true } : msg
            : isAdmin && msg.sent ? {...msg, read: true} : msg})]
          });
          global.io.to(`inbox:${inboxId}`).emit("messages-read", { inboxId });
        })

        socket.on("update-project", async ({ projectId, update }) => {
          const project = await Project.findByIdAndUpdate(projectId, update, { new: true });
          if (project) global.io.to(`project:${projectId}`).emit("project-updated", project);
        });

        socket.on("disconnect", () => console.log("Socket disconnected"));
      } catch (err) {
        socket.disconnect(true);
        NextResponse({error: "Socket connection error:", err} , {status: 500});
      }
    });
  }

  return NextResponse.json({ message: "Socket.IO server running" } ,{status: 200});
}
